package middleware

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func JWT(secret []byte, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, ok := bearerToken(r.Header.Get("Authorization"))
		if !ok {
			writeJSON(w, http.StatusUnauthorized, map[string]any{"error": "missing bearer token"})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}
			return secret, nil
		})
		if err != nil || !token.Valid {
			writeJSON(w, http.StatusUnauthorized, map[string]any{"error": "invalid token"})
			return
		}

		next.ServeHTTP(w, r)
	})
}

func bearerToken(header string) (string, bool) {
	parts := strings.Fields(header)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return "", false
	}
	return parts[1], true
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
