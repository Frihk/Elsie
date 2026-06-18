package handlers

import "net/http"

func (s *Server) Upload(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "upload handler scaffolded",
	})
}
