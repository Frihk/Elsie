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
)

func main() {
	port := env("PORT", "8080")
	clientOrigin := env("CLIENT_ORIGIN", "http://localhost:5173")
	databasePath := env("DATABASE_PATH", "data/elsie.sqlite")
	jwtSecret := env("JWT_SECRET", "change-me-in-production")
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
		DB:        store,
		JWTSecret: []byte(jwtSecret),
		UploadDir: uploadDir,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/login", allowMethods([]string{http.MethodPost}, server.Login))
	mux.HandleFunc("/api/content", allowMethods([]string{http.MethodGet, http.MethodPost}, dispatch(server.GetContent, server.PostContent)))
	mux.HandleFunc("/api/settings", allowMethods([]string{http.MethodGet, http.MethodPost}, dispatch(server.GetSettings, server.PostSettings)))
	mux.HandleFunc("/api/upload", allowMethods([]string{http.MethodPost}, server.Upload))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusNotFound, map[string]any{"error": "not found"})
	})

	handler := withCORS(clientOrigin, server.WithJWT(mux))

	httpServer := &http.Server{
		Addr:              ":" + port,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("Elsie API listening on port %s", port)
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

func withCORS(clientOrigin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == clientOrigin {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
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
