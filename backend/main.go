package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
)

func main() {
	InitDB()
	defer DB.Close()

	mux := http.NewServeMux()

	// News: list (with optional ?page=&limit=) and detail
	mux.HandleFunc("/api/news", getNewsHandler)
	mux.HandleFunc("/api/news/", func(w http.ResponseWriter, r *http.Request) {
		// /api/news/123
		if strings.Count(r.URL.Path, "/") == 3 {
			getNewsDetailHandler(w, r)
			return
		}
		http.NotFound(w, r)
	})

	mux.HandleFunc("/api/subdirectorates", getSubdirectoratesHandler)
	mux.HandleFunc("/api/settings", getSettingsHandler)

	// Auth routes
	mux.HandleFunc("/api/auth/login", loginHandler)

	// Program Kerja routes
	mux.HandleFunc("/api/program-kerja", getProgramKerjaHandler)

	// Admin routes (protected)
	mux.HandleFunc("/api/admin/settings", authMiddleware(updateSettingsHandler))
	mux.HandleFunc("/api/admin/upload", authMiddleware(uploadHandler))
	mux.HandleFunc("/api/admin/users", authMiddleware(usersHandler))
	mux.HandleFunc("/api/admin/users/", authMiddleware(usersDetailHandler))
	mux.HandleFunc("/api/admin/news", authMiddleware(adminNewsHandler))
	mux.HandleFunc("/api/admin/news/", authMiddleware(adminNewsDetailHandler))
	mux.HandleFunc("/api/admin/program-kerja", authMiddleware(adminProgramKerjaHandler))
	mux.HandleFunc("/api/admin/program-kerja/", authMiddleware(adminProgramKerjaDetailHandler))

	// Serve uploads folder statically
	fs := http.FileServer(http.Dir("./uploads"))
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	handler := enableCORS(mux)

	port := "8081"
	fmt.Printf("Server starting on http://localhost:%s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
