package handlers

import (
	"encoding/json"
	"net/http"
)

type settingRequest struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func (s *Server) GetSettings(w http.ResponseWriter, r *http.Request) {
	settings, err := s.DB.Settings()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not load settings"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"settings": settings})
}

func (s *Server) PostSettings(w http.ResponseWriter, r *http.Request) {
	var request settingRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid json"})
		return
	}
	if request.Key == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "key is required"})
		return
	}

	if err := s.DB.UpsertSetting(request.Key, request.Value); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not save setting"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ok":    true,
		"key":   request.Key,
		"value": request.Value,
	})
}
