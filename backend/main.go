package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"elsie/db"
	"elsie/handlers"
	"elsie/middleware"
)

func main() {
	port := env("PORT", "8080")
	clientOrigin := env("CLIENT_ORIGIN", "http://localhost:5173")
	productionOrigin := env("PRODUCTION_ORIGIN", "")
	databasePath := env("DATABASE_PATH", "data/eira.sqlite")
	jwtSecret := env("JWT_SECRET", "change-me-in-production")
	adminPassword := env("ADMIN_PASSWORD", "")
	uploadDir := env("UPLOAD_DIR", "static/uploads")

	store, err := db.Init(databasePath)
	if err != nil {
		log.Fatalf("initialise database: %v", err)
	}
	defer store.Close()

	if err := os.MkdirAll(uploadDir, 0o755); err != nil {
		log.Fatalf("create upload directory: %v", err)
	}

	server := &handlers.Server{
		DB:            store,
		JWTSecret:     []byte(jwtSecret),
		AdminPassword: adminPassword,
		UploadDir:     uploadDir,
	}

	protected := func(handler http.HandlerFunc) http.HandlerFunc {
		return middleware.JWT([]byte(jwtSecret), http.HandlerFunc(handler)).ServeHTTP
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/login", allowMethods([]string{http.MethodPost}, server.Login))
	mux.HandleFunc("/api/content", allowMethods([]string{http.MethodGet, http.MethodPost}, dispatch(server.GetContent, protected(server.PostContent))))
	mux.HandleFunc("/api/settings", allowMethods([]string{http.MethodGet, http.MethodPost}, dispatch(server.GetSettings, protected(server.PostSettings))))
	mux.HandleFunc("/api/blocks", allowMethods([]string{http.MethodGet, http.MethodPost}, dispatch(server.GetBlocks, protected(server.PostBlocks))))
	mux.HandleFunc("/api/blocks/", allowMethods([]string{http.MethodDelete}, protected(server.DeleteBlock)))
	mux.HandleFunc("/api/upload", allowMethods([]string{http.MethodPost}, protected(server.Upload)))
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(uploadDir))))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusNotFound, map[string]any{"error": "not found"})
	})

	handler := withCORS([]string{clientOrigin, productionOrigin}, mux)

	httpServer := &http.Server{
		Addr:              ":" + port,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("Eira API listening on port %s", port)
	if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("server stopped: %v", err)
	}
}

func dispatch(getHandler, postHandler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			getHandler(w, r)
		case http.MethodPost:
			postHandler(w, r)
		default:
			w.Header().Set("Allow", "GET, POST, OPTIONS")
			writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"error": "method not allowed"})
		}
	}
}

func allowMethods(methods []string, handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		for _, method := range methods {
			if r.Method == method {
				handler(w, r)
				return
			}
		}

		allowed := append(append([]string{}, methods...), http.MethodOptions)
		w.Header().Set("Allow", strings.Join(allowed, ", "))
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"error": "method not allowed"})
	}
}

func withCORS(allowedOrigins []string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		for _, allowed := range allowedOrigins {
			if allowed != "" && origin == allowed {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
				break
			}
		}
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func env(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
