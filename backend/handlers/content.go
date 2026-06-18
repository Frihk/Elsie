package handlers

import "net/http"

func (s *Server) GetContent(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "get content handler scaffolded",
	})
}

func (s *Server) PostContent(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "post content handler scaffolded",
	})
}
