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

	// Serve uploads folder statically
	fs := http.FileServer(http.Dir("./uploads"))
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	handler := enableCORS(mux)

	port := "8081"
	fmt.Printf("Server starting on http://localhost:%s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
