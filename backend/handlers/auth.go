package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"elsie/db"

	"github.com/golang-jwt/jwt/v5"
)

type Server struct {
	DB            *db.DB
	JWTSecret     []byte
	AdminPassword string
	UploadDir     string
}

type loginRequest struct {
	Password string `json:"password"`
}

func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
	var request loginRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid json"})
		return
	}
	if s.AdminPassword == "" || request.Password != s.AdminPassword {
		writeJSON(w, http.StatusUnauthorized, map[string]any{"error": "incorrect password"})
		return
	}

	expiresAt := time.Now().Add(24 * time.Hour)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"role": "admin",
		"exp":  expiresAt.Unix(),
		"iat":  time.Now().Unix(),
	})

	tokenString, err := token.SignedString(s.JWTSecret)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not sign token"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"token":      tokenString,
		"expires_at": expiresAt.Format(time.RFC3339),
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
