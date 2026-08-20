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
	mux.HandleFunc("/api/akses-pegawai", getAksesPegawaiHandler)
	mux.HandleFunc("/api/rekrutmen", getRekrutmenHandler)
	mux.HandleFunc("/api/pengembangan-talenta", getPengembanganTalentaHandler)
	mux.HandleFunc("/api/pengembangan-talenta/", func(w http.ResponseWriter, r *http.Request) {
		if strings.Count(r.URL.Path, "/") == 3 {
			getPengembanganTalentaDetailHandler(w, r)
			return
		}
		http.NotFound(w, r)
	})

	// Public Informasi & Dokumen Terkini routes
	mux.HandleFunc("/api/informasi", getInformasiHandler)
	mux.HandleFunc("/api/dokumen-terkini", getDokumenTerkiniHandler)

	// Admin routes (protected)
	mux.HandleFunc("/api/admin/settings", authMiddleware(updateSettingsHandler))
	mux.HandleFunc("/api/admin/upload", authMiddleware(uploadHandler))
	mux.HandleFunc("/api/admin/users", authMiddleware(usersHandler))
	mux.HandleFunc("/api/admin/users/", authMiddleware(usersDetailHandler))
	mux.HandleFunc("/api/admin/news", authMiddleware(adminNewsHandler))
	mux.HandleFunc("/api/admin/news/", authMiddleware(adminNewsDetailHandler))
	mux.HandleFunc("/api/admin/program-kerja", authMiddleware(adminProgramKerjaHandler))
	mux.HandleFunc("/api/admin/program-kerja/", authMiddleware(adminProgramKerjaDetailHandler))
	mux.HandleFunc("/api/admin/akses-pegawai/reorder", authMiddleware(adminAksesPegawaiReorderHandler))
	mux.HandleFunc("/api/admin/akses-pegawai", authMiddleware(adminAksesPegawaiHandler))
	mux.HandleFunc("/api/admin/akses-pegawai/", authMiddleware(adminAksesPegawaiDetailHandler))
	mux.HandleFunc("/api/admin/rekrutmen/reorder", authMiddleware(adminRekrutmenReorderHandler))
	mux.HandleFunc("/api/admin/rekrutmen", authMiddleware(adminRekrutmenHandler))
	mux.HandleFunc("/api/admin/rekrutmen/", authMiddleware(adminRekrutmenDetailHandler))
	mux.HandleFunc("/api/admin/pengembangan-talenta/reorder", authMiddleware(adminPengembanganTalentaReorderHandler))
	mux.HandleFunc("/api/admin/pengembangan-talenta", authMiddleware(adminPengembanganTalentaHandler))
	mux.HandleFunc("/api/admin/pengembangan-talenta/", authMiddleware(adminPengembanganTalentaDetailHandler))

	// Admin Informasi routes
	mux.HandleFunc("/api/admin/informasi/reorder", authMiddleware(adminInformasiReorderHandler))
	mux.HandleFunc("/api/admin/informasi", authMiddleware(adminInformasiHandler))
	mux.HandleFunc("/api/admin/informasi/", authMiddleware(adminInformasiDetailHandler))

	// Admin Dokumen Terkini routes
	mux.HandleFunc("/api/admin/dokumen-terkini/reorder", authMiddleware(adminDokumenTerkiniReorderHandler))
	mux.HandleFunc("/api/admin/dokumen-terkini", authMiddleware(adminDokumenTerkiniHandler))
	mux.HandleFunc("/api/admin/dokumen-terkini/", authMiddleware(adminDokumenTerkiniDetailHandler))



	// Serve uploads folder statically
	fs := http.FileServer(http.Dir("./uploads"))
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	handler := enableCORS(mux)

	port := "8081"
	fmt.Printf("Server starting on http://localhost:%s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
