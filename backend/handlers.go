package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
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
	if err := DB.QueryRow(ctx, "SELECT COUNT(*) FROM news WHERE status = 'published'").Scan(&total); err != nil {
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
			"SELECT id, title, content, image_url, published_at, COALESCE(author, ''), COALESCE(slug, ''), COALESCE(status, 'published'), COALESCE(images, '[]'), COALESCE(thumbnail_idx, 0) FROM news WHERE status = 'published' ORDER BY published_at DESC, id DESC LIMIT $1 OFFSET $2",
			limit, offset,
		)
		if err != nil {
			http.Error(w, "DB error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		rows = r2
	} else {
		r2, err := DB.Query(ctx, "SELECT id, title, content, image_url, published_at, COALESCE(author, ''), COALESCE(slug, ''), COALESCE(status, 'published'), COALESCE(images, '[]'), COALESCE(thumbnail_idx, 0) FROM news WHERE status = 'published' ORDER BY published_at DESC, id DESC")
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
		if err := rows.Scan(&n.ID, &n.Title, &n.Content, &n.ImageURL, &n.PublishedAt, &n.Author, &n.Slug, &n.Status, &n.Images, &n.ThumbnailIdx); err != nil {
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
		"SELECT id, title, content, image_url, published_at, COALESCE(author, ''), COALESCE(slug, ''), COALESCE(status, 'published'), COALESCE(images, '[]'), COALESCE(thumbnail_idx, 0) FROM news WHERE id = $1", id,
	).Scan(&n.ID, &n.Title, &n.Content, &n.ImageURL, &n.PublishedAt, &n.Author, &n.Slug, &n.Status, &n.Images, &n.ThumbnailIdx)
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

// PUT /api/admin/settings
func updateSettingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var updates map[string]string
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	for key, value := range updates {
		_, err := DB.Exec(ctx,
			`INSERT INTO settings (key, value) VALUES ($1, $2)
			 ON CONFLICT (key) DO UPDATE SET value = $2`,
			key, value,
		)
		if err != nil {
			http.Error(w, "Failed to update setting: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// POST /api/admin/upload
func uploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 10 MB max
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to read file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate unique filename
	ext := filepath.Ext(handler.Filename)
	newFilename := fmt.Sprintf("upload_%d%s", time.Now().UnixNano(), ext)

	// Ensure uploads directory exists
	os.MkdirAll("./uploads", os.ModePerm)

	dst, err := os.Create(filepath.Join("./uploads", newFilename))
	if err != nil {
		http.Error(w, "Failed to create file: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Failed to save file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	filePath := "/uploads/" + newFilename

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"url": filePath})
}

// GET /api/admin/users
// POST /api/admin/users
func usersHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	switch r.Method {
	case http.MethodGet:
		rows, err := DB.Query(ctx, "SELECT id, username, name, email, COALESCE(role, 'admin'), COALESCE(created_at, NOW()) FROM users ORDER BY id ASC")
		if err != nil {
			http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var usersList []User
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.ID, &u.Username, &u.Name, &u.Email, &u.Role, &u.CreatedAt); err != nil {
				http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
				return
			}
			usersList = append(usersList, u)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(usersList)

	case http.MethodPost:
		var u struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Name     string `json:"name"`
			Email    string `json:"email"`
			Role     string `json:"role"`
		}
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if u.Username == "" || u.Password == "" || u.Name == "" || u.Email == "" {
			http.Error(w, "Semua field harus diisi", http.StatusBadRequest)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Password hashing error", http.StatusInternalServerError)
			return
		}

		var newID int
		err = DB.QueryRow(ctx,
			"INSERT INTO users (username, password, name, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			u.Username, string(hashedPassword), u.Name, u.Email, u.Role,
		).Scan(&newID)

		if err != nil {
			http.Error(w, "Duplicate username atau email: "+err.Error(), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "created", "id": newID})
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// PUT /api/admin/users/{id}
// DELETE /api/admin/users/{id}
func usersDetailHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 4 {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	idStr := parts[3]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		var u struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Name     string `json:"name"`
			Email    string `json:"email"`
			Role     string `json:"role"`
		}
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, "Invalid body", http.StatusBadRequest)
			return
		}

		if u.Username == "" || u.Name == "" || u.Email == "" {
			http.Error(w, "Username, Name, and Email are required", http.StatusBadRequest)
			return
		}

		if u.Password != "" {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
			if err != nil {
				http.Error(w, "Hashing failed", http.StatusInternalServerError)
				return
			}
			_, err = DB.Exec(ctx,
				"UPDATE users SET username=$1, password=$2, name=$3, email=$4, role=$5 WHERE id=$6",
				u.Username, string(hashedPassword), u.Name, u.Email, u.Role, id,
			)
			if err != nil {
				http.Error(w, "Update failed: "+err.Error(), http.StatusBadRequest)
				return
			}
		} else {
			_, err = DB.Exec(ctx,
				"UPDATE users SET username=$1, name=$2, email=$3, role=$4 WHERE id=$5",
				u.Username, u.Name, u.Email, u.Role, id,
			)
			if err != nil {
				http.Error(w, "Update failed: "+err.Error(), http.StatusBadRequest)
				return
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "updated"})

	case http.MethodDelete:
		// Prevent deleting the main admin with ID 1
		if id == 1 {
			http.Error(w, "Superadmin utama tidak dapat dihapus", http.StatusBadRequest)
			return
		}

		_, err := DB.Exec(ctx, "DELETE FROM users WHERE id=$1", id)
		if err != nil {
			http.Error(w, "Delete failed: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// GET /api/admin/news (List all news, both draft and published)
// POST /api/admin/news (Create news)
func adminNewsHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	switch r.Method {
	case http.MethodGet:
		rows, err := DB.Query(ctx, "SELECT id, title, content, image_url, published_at, COALESCE(author, ''), COALESCE(slug, ''), COALESCE(status, 'published'), COALESCE(images, '[]'), COALESCE(thumbnail_idx, 0) FROM news ORDER BY published_at DESC, id DESC")
		if err != nil {
			http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var newsList []News
		for rows.Next() {
			var n News
			if err := rows.Scan(&n.ID, &n.Title, &n.Content, &n.ImageURL, &n.PublishedAt, &n.Author, &n.Slug, &n.Status, &n.Images, &n.ThumbnailIdx); err != nil {
				http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
				return
			}
			newsList = append(newsList, n)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(newsList)

	case http.MethodPost:
		var n struct {
			Title        string    `json:"title"`
			Content      string    `json:"content"`
			ImageURL     string    `json:"image_url"`
			PublishedAt  time.Time `json:"published_at"`
			Author       string    `json:"author"`
			Slug         string    `json:"slug"`
			Status       string    `json:"status"`
			Images       string    `json:"images"`
			ThumbnailIdx int       `json:"thumbnail_idx"`
		}
		if err := json.NewDecoder(r.Body).Decode(&n); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if n.Title == "" || n.Content == "" {
			http.Error(w, "Judul dan Konten berita tidak boleh kosong", http.StatusBadRequest)
			return
		}

		if n.PublishedAt.IsZero() {
			n.PublishedAt = time.Now()
		}

		var newID int
		err := DB.QueryRow(ctx,
			`INSERT INTO news (title, content, image_url, published_at, author, slug, status, images, thumbnail_idx) 
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
			n.Title, n.Content, n.ImageURL, n.PublishedAt, n.Author, n.Slug, n.Status, n.Images, n.ThumbnailIdx,
		).Scan(&newID)

		if err != nil {
			http.Error(w, "Database insert error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "created", "id": newID})
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// PUT /api/admin/news/{id}
// DELETE /api/admin/news/{id}
func adminNewsDetailHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 4 {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	idStr := parts[3]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		var n struct {
			Title        string    `json:"title"`
			Content      string    `json:"content"`
			ImageURL     string    `json:"image_url"`
			PublishedAt  time.Time `json:"published_at"`
			Author       string    `json:"author"`
			Slug         string    `json:"slug"`
			Status       string    `json:"status"`
			Images       string    `json:"images"`
			ThumbnailIdx int       `json:"thumbnail_idx"`
		}
		if err := json.NewDecoder(r.Body).Decode(&n); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if n.Title == "" || n.Content == "" {
			http.Error(w, "Judul dan Konten berita tidak boleh kosong", http.StatusBadRequest)
			return
		}

		if n.PublishedAt.IsZero() {
			n.PublishedAt = time.Now()
		}

		_, err = DB.Exec(ctx,
			`UPDATE news SET title=$1, content=$2, image_url=$3, published_at=$4, author=$5, slug=$6, status=$7, images=$8, thumbnail_idx=$9 
			 WHERE id=$10`,
			n.Title, n.Content, n.ImageURL, n.PublishedAt, n.Author, n.Slug, n.Status, n.Images, n.ThumbnailIdx, id,
		)
		if err != nil {
			http.Error(w, "Database update error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "updated"})

	case http.MethodDelete:
		_, err := DB.Exec(ctx, "DELETE FROM news WHERE id=$1", id)
		if err != nil {
			http.Error(w, "Database delete error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getProgramKerjaHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := context.Background()
	rows, err := DB.Query(ctx, "SELECT id, title, description, icon_name FROM program_kerja ORDER BY id ASC")
	if err != nil {
		http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	pkList := []ProgramKerja{}
	for rows.Next() {
		var pk ProgramKerja
		if err := rows.Scan(&pk.ID, &pk.Title, &pk.Description, &pk.IconName); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		pkList = append(pkList, pk)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pkList)
}

func adminProgramKerjaHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	switch r.Method {
	case http.MethodGet:
		rows, err := DB.Query(ctx, "SELECT id, title, description, icon_name FROM program_kerja ORDER BY id ASC")
		if err != nil {
			http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		pkList := []ProgramKerja{}
		for rows.Next() {
			var pk ProgramKerja
			if err := rows.Scan(&pk.ID, &pk.Title, &pk.Description, &pk.IconName); err != nil {
				http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
				return
			}
			pkList = append(pkList, pk)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(pkList)

	case http.MethodPost:
		var pk struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			IconName    string `json:"icon_name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&pk); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if pk.Title == "" || pk.Description == "" {
			http.Error(w, "Title dan Description tidak boleh kosong", http.StatusBadRequest)
			return
		}

		var newID int
		err := DB.QueryRow(ctx,
			"INSERT INTO program_kerja (title, description, icon_name) VALUES ($1, $2, $3) RETURNING id",
			pk.Title, pk.Description, pk.IconName,
		).Scan(&newID)
		if err != nil {
			http.Error(w, "Database insert error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "created", "id": newID})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func adminProgramKerjaDetailHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 4 {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	idStr := parts[3]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		var pk struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			IconName    string `json:"icon_name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&pk); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if pk.Title == "" || pk.Description == "" {
			http.Error(w, "Title dan Description tidak boleh kosong", http.StatusBadRequest)
			return
		}

		_, err = DB.Exec(ctx,
			"UPDATE program_kerja SET title=$1, description=$2, icon_name=$3 WHERE id=$4",
			pk.Title, pk.Description, pk.IconName, id,
		)
		if err != nil {
			http.Error(w, "Database update error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "updated"})

	case http.MethodDelete:
		_, err := DB.Exec(ctx, "DELETE FROM program_kerja WHERE id=$1", id)
		if err != nil {
			http.Error(w, "Database delete error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// GET /api/akses-pegawai
func getAksesPegawaiHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := context.Background()
	rows, err := DB.Query(ctx, "SELECT id, title, description, link, position FROM akses_pegawai ORDER BY position ASC, id ASC")
	if err != nil {
		http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var list []AksesPegawai
	for rows.Next() {
		var ap AksesPegawai
		if err := rows.Scan(&ap.ID, &ap.Title, &ap.Description, &ap.Link, &ap.Position); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		list = append(list, ap)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

// GET /api/admin/akses-pegawai
// POST /api/admin/akses-pegawai
func adminAksesPegawaiHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	switch r.Method {
	case http.MethodGet:
		rows, err := DB.Query(ctx, "SELECT id, title, description, link, position FROM akses_pegawai ORDER BY position ASC, id ASC")
		if err != nil {
			http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var list []AksesPegawai
		for rows.Next() {
			var ap AksesPegawai
			if err := rows.Scan(&ap.ID, &ap.Title, &ap.Description, &ap.Link, &ap.Position); err != nil {
				http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
				return
			}
			list = append(list, ap)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(list)

	case http.MethodPost:
		var ap struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			Link        string `json:"link"`
		}
		if err := json.NewDecoder(r.Body).Decode(&ap); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if ap.Title == "" || ap.Description == "" || ap.Link == "" {
			http.Error(w, "Title, Description, dan Link tidak boleh kosong", http.StatusBadRequest)
			return
		}

		// Get max position
		var maxPos int
		err := DB.QueryRow(ctx, "SELECT COALESCE(MAX(position), 0) FROM akses_pegawai").Scan(&maxPos)
		if err != nil {
			maxPos = 0
		}
		nextPos := maxPos + 1

		var newID int
		err = DB.QueryRow(ctx,
			"INSERT INTO akses_pegawai (title, description, link, position) VALUES ($1, $2, $3, $4) RETURNING id",
			ap.Title, ap.Description, ap.Link, nextPos,
		).Scan(&newID)
		if err != nil {
			http.Error(w, "Database insert error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "created", "id": newID})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// PUT /api/admin/akses-pegawai/{id}
// DELETE /api/admin/akses-pegawai/{id}
func adminAksesPegawaiDetailHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 4 {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	idStr := parts[3]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		var ap struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			Link        string `json:"link"`
			Position    int    `json:"position"`
		}
		if err := json.NewDecoder(r.Body).Decode(&ap); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if ap.Title == "" || ap.Description == "" || ap.Link == "" {
			http.Error(w, "Title, Description, dan Link tidak boleh kosong", http.StatusBadRequest)
			return
		}

		_, err = DB.Exec(ctx,
			"UPDATE akses_pegawai SET title=$1, description=$2, link=$3, position=$4 WHERE id=$5",
			ap.Title, ap.Description, ap.Link, ap.Position, id,
		)
		if err != nil {
			http.Error(w, "Database update error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "updated"})

	case http.MethodDelete:
		_, err := DB.Exec(ctx, "DELETE FROM akses_pegawai WHERE id=$1", id)
		if err != nil {
			http.Error(w, "Database delete error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// POST /api/admin/akses-pegawai/reorder
func adminAksesPegawaiReorderHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := context.Background()
	var payload struct {
		IDs []int `json:"ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
		return
	}

	for idx, id := range payload.IDs {
		_, err := DB.Exec(ctx, "UPDATE akses_pegawai SET position=$1 WHERE id=$2", idx+1, id)
		if err != nil {
			http.Error(w, "Database reorder error: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "reordered"})
}

// GET /api/rekrutmen
func getRekrutmenHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := context.Background()
	rows, err := DB.Query(ctx, "SELECT id, title, link, position FROM rekrutmen ORDER BY position ASC, id ASC")
	if err != nil {
		http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var list []Rekrutmen
	for rows.Next() {
		var rec Rekrutmen
		if err := rows.Scan(&rec.ID, &rec.Title, &rec.Link, &rec.Position); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		list = append(list, rec)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

// GET /api/admin/rekrutmen
// POST /api/admin/rekrutmen
func adminRekrutmenHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	switch r.Method {
	case http.MethodGet:
		rows, err := DB.Query(ctx, "SELECT id, title, link, position FROM rekrutmen ORDER BY position ASC, id ASC")
		if err != nil {
			http.Error(w, "Database query error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var list []Rekrutmen
		for rows.Next() {
			var rec Rekrutmen
			if err := rows.Scan(&rec.ID, &rec.Title, &rec.Link, &rec.Position); err != nil {
				http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
				return
			}
			list = append(list, rec)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(list)

	case http.MethodPost:
		var rec struct {
			Title string `json:"title"`
			Link  string `json:"link"`
		}
		if err := json.NewDecoder(r.Body).Decode(&rec); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if rec.Title == "" || rec.Link == "" {
			http.Error(w, "Title dan Link tidak boleh kosong", http.StatusBadRequest)
			return
		}

		var maxPos int
		err := DB.QueryRow(ctx, "SELECT COALESCE(MAX(position), 0) FROM rekrutmen").Scan(&maxPos)
		if err != nil {
			maxPos = 0
		}
		nextPos := maxPos + 1

		var newID int
		err = DB.QueryRow(ctx,
			"INSERT INTO rekrutmen (title, link, position) VALUES ($1, $2, $3) RETURNING id",
			rec.Title, rec.Link, nextPos,
		).Scan(&newID)
		if err != nil {
			http.Error(w, "Database insert error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "created", "id": newID})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// PUT /api/admin/rekrutmen/{id}
// DELETE /api/admin/rekrutmen/{id}
func adminRekrutmenDetailHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 4 {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	idStr := parts[3]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		var rec struct {
			Title    string `json:"title"`
			Link     string `json:"link"`
			Position int    `json:"position"`
		}
		if err := json.NewDecoder(r.Body).Decode(&rec); err != nil {
			http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if rec.Title == "" || rec.Link == "" {
			http.Error(w, "Title dan Link tidak boleh kosong", http.StatusBadRequest)
			return
		}

		_, err = DB.Exec(ctx,
			"UPDATE rekrutmen SET title=$1, link=$2, position=$3 WHERE id=$4",
			rec.Title, rec.Link, rec.Position, id,
		)
		if err != nil {
			http.Error(w, "Database update error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "updated"})

	case http.MethodDelete:
		_, err := DB.Exec(ctx, "DELETE FROM rekrutmen WHERE id=$1", id)
		if err != nil {
			http.Error(w, "Database delete error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// POST /api/admin/rekrutmen/reorder
func adminRekrutmenReorderHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ctx := context.Background()
	var payload struct {
		IDs []int `json:"ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid body: "+err.Error(), http.StatusBadRequest)
		return
	}

	for idx, id := range payload.IDs {
		_, err := DB.Exec(ctx, "UPDATE rekrutmen SET position=$1 WHERE id=$2", idx+1, id)
		if err != nil {
			http.Error(w, "Database reorder error: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "reordered"})
}


