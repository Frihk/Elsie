package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type blockRequest struct {
	ID         int64           `json:"id"`
	Page       string          `json:"page"`
	BlockType  string          `json:"block_type"`
	OrderIndex int             `json:"order_index"`
	Data       json.RawMessage `json:"data"`
}

func (s *Server) GetBlocks(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")
	blockType := r.URL.Query().Get("type")
	if page == "" || blockType == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "page and type are required"})
		return
	}

	blocks, err := s.DB.Blocks(page, blockType)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not load blocks"})
		return
	}

	response := make([]map[string]any, 0, len(blocks))
	for _, block := range blocks {
		var data any
		if err := json.Unmarshal([]byte(block.Data), &data); err != nil {
			data = map[string]any{}
		}
		response = append(response, map[string]any{
			"id":          block.ID,
			"page":        block.Page,
			"block_type":  block.BlockType,
			"order_index": block.OrderIndex,
			"data":        data,
			"updated_at":  block.UpdatedAt,
		})
	}

	writeJSON(w, http.StatusOK, map[string]any{"blocks": response})
}

func (s *Server) PostBlocks(w http.ResponseWriter, r *http.Request) {
	var request blockRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid json"})
		return
	}
	if request.Page == "" || request.BlockType == "" || len(request.Data) == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "page, block_type, and data are required"})
		return
	}

	id, err := s.DB.UpsertBlock(request.ID, request.Page, request.BlockType, request.OrderIndex, string(request.Data))
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not save block"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"id": id,
	})
}

func (s *Server) DeleteBlock(w http.ResponseWriter, r *http.Request) {
	idText := strings.TrimPrefix(r.URL.Path, "/api/blocks/")
	id, err := strconv.ParseInt(idText, 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "valid block id is required"})
		return
	}

	if err := s.DB.DeleteBlock(id); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": "could not delete block"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}
