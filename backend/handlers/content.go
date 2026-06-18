package handlers

import (
	"encoding/json"
	"net/http"
)

type contentRequest struct {
	Page     string `json:"page"`
	FieldKey string `json:"field_key"`
	Value    string `json:"value"`
}

func (s *Server) GetContent(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")
	if page == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "page is required"})
		return
	}

	content, err := s.DB.Content(page)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not load content"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"page":    page,
		"content": content,
	})
}

func (s *Server) PostContent(w http.ResponseWriter, r *http.Request) {
	var request contentRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid json"})
		return
	}
	if request.Page == "" || request.FieldKey == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "page and field_key are required"})
		return
	}

	if err := s.DB.UpsertContent(request.Page, request.FieldKey, request.Value); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not save content"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ok":        true,
		"page":      request.Page,
		"field_key": request.FieldKey,
		"value":     request.Value,
	})
}
