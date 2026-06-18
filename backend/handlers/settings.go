package handlers

import "net/http"

func (s *Server) GetSettings(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "get settings handler scaffolded",
	})
}

func (s *Server) PostSettings(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok":      true,
		"message": "post settings handler scaffolded",
	})
}
