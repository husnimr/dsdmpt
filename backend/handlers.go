package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

type NewsResponse struct {
	Data       []News `json:"data"`
	Total      int    `json:"total"`
	Page       int    `json:"page"`
	Limit      int    `json:"limit"`
	TotalPages int    `json:"total_pages"`
}

// GET /api/news?page=1&limit=6
func getNewsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx := context.Background()

	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	limit := 0

	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	var total int
	if err := DB.QueryRow(ctx, "SELECT COUNT(*) FROM news").Scan(&total); err != nil {
		http.Error(w, "Count error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var rows interface {
		Close()
		Next() bool
		Scan(dest ...interface{}) error
	}

	if limit > 0 {
		offset := (page - 1) * limit
		r2, err := DB.Query(ctx,
			"SELECT id, title, content, image_url, published_at FROM news ORDER BY published_at DESC, id ASC LIMIT $1 OFFSET $2",
			limit, offset,
		)
		if err != nil {
			http.Error(w, "DB error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		rows = r2
	} else {
		r2, err := DB.Query(ctx, "SELECT id, title, content, image_url, published_at FROM news ORDER BY published_at DESC, id ASC")
		if err != nil {
			http.Error(w, "DB error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		rows = r2
	}
	defer rows.Close()

	newsList := []News{}
	for rows.Next() {
		var n News
		if err := rows.Scan(&n.ID, &n.Title, &n.Content, &n.ImageURL, &n.PublishedAt); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		newsList = append(newsList, n)
	}

	totalPages := 1
	if limit > 0 && total > 0 {
		totalPages = (total + limit - 1) / limit
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(NewsResponse{
		Data:       newsList,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	})
}

// GET /api/news/{id}
func getNewsDetailHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Path[len("/api/news/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	var n News
	err = DB.QueryRow(ctx,
		"SELECT id, title, content, image_url, published_at FROM news WHERE id = $1", id,
	).Scan(&n.ID, &n.Title, &n.Content, &n.ImageURL, &n.PublishedAt)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(n)
}

func getSubdirectoratesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx := context.Background()
	rows, err := DB.Query(ctx, "SELECT id, name, icon, description FROM subdirectorates ORDER BY id ASC")
	if err != nil {
		http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	subList := []Subdirectorate{}
	for rows.Next() {
		var s Subdirectorate
		if err := rows.Scan(&s.ID, &s.Name, &s.Icon, &s.Description); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		subList = append(subList, s)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(subList)
}

func getSettingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx := context.Background()
	rows, err := DB.Query(ctx, "SELECT key, value FROM settings")
	if err != nil {
		http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	settingsMap := make(map[string]string)
	for rows.Next() {
		var key, val string
		if err := rows.Scan(&key, &val); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		settingsMap[key] = val
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(settingsMap)
}
