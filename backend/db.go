package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func InitDB() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:postgres123@localhost:5432/dsdmpt?sslmode=disable"
	}

	var err error
	DB, err = pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	err = DB.Ping(context.Background())
	if err != nil {
		log.Fatalf("Database connection check failed: %v\n", err)
	}

	fmt.Println("Connected to PostgreSQL database successfully!")

	createTables()
	seedData()
}

func createTables() {
	ctx := context.Background()

	// News Table
	_, err := DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS news (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			image_url VARCHAR(255) NOT NULL,
			published_at DATE NOT NULL
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create news table: %v", err)
	}

	// Subdirectorates Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS subdirectorates (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			icon VARCHAR(50) NOT NULL,
			description TEXT NOT NULL
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create subdirectorates table: %v", err)
	}

	// Settings Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS settings (
			key VARCHAR(100) PRIMARY KEY,
			value TEXT NOT NULL
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create settings table: %v", err)
	}

	fmt.Println("Database schemas verified/created.")
}

func seedData() {
	ctx := context.Background()

	// 1. Seed Settings if empty
	var settingsCount int
	err := DB.QueryRow(ctx, "SELECT COUNT(*) FROM settings").Scan(&settingsCount)
	if err != nil {
		log.Fatalf("Failed to check settings count: %v", err)
	}

	if settingsCount == 0 {
		defaultSettings := map[string]string{
			"hero_title":    "DSDMPT",
			"hero_subtitle": "Akses semua layanan Sumber Daya Manusia dan Pengembangan Talenta melalui sistem terintegrasi kami.",
			"hero_image":    "/uploads/ui_rectorate_hero.png",
			
			"about_title": "Tentang Direktorat SDM dan Pengembangan Talenta",
			"about_text":  "Direktorat SDM dan Pengembangan Talenta adalah salah satu Direktorat yang di bawah Wakil Rektor bidang Perencanaan, Keuangan, dan SDM. Menjadikan UI sebagai Pusat Talenta terbaik merupakan sasaran strategis yang diamanahkan kepada Direktorat SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.",
			"about_image": "/uploads/ui_staff_group.png",
			
			"values_title": "9 Nilai Dasar Universitas Indonesia",
			"values_text":  "Demi Mewujudkan Visi Universitas Indonesia, Miliki 9 Nilai Dasar Sesuai dengan fungsi universitas sebagai rumah dan lumbung pengetahuan, teladan, dan kekuatan moral bagi masyarakat, Universitas Indonesia (UI) memiliki nilai-nilai dasar yang harus dijunjung tinggi oleh sivitas akademika-nya.",
			"values_image": "/uploads/ui_rectorate_hero.png",
		}

		for k, v := range defaultSettings {
			_, err := DB.Exec(ctx, "INSERT INTO settings (key, value) VALUES ($1, $2)", k, v)
			if err != nil {
				log.Printf("Failed to seed setting key %s: %v", k, err)
			}
		}
		fmt.Println("Seeded page settings.")
	}

	// 2. Seed Subdirectorates if empty
	var subsCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM subdirectorates").Scan(&subsCount)
	if err != nil {
		log.Fatalf("Failed to check subdirectorates count: %v", err)
	}

	if subsCount == 0 {
		subs := []Subdirectorate{
			{
				Name:        "Subdirektorat Pengembangan Organisasi dan Sistem SDM",
				Icon:        "people",
				Description: "Fokus pada pengembangan struktur organisasi yang adaptif serta implementasi sistem manajemen SDM terintegrasi.",
			},
			{
				Name:        "Subdirektorat Remunerasi dan Kesejahteraan Pegawai",
				Icon:        "user",
				Description: "Mengelola kebijakan kompensasi, tunjangan, dan program kesejahteraan guna meningkatkan motivasi pegawai.",
			},
			{
				Name:        "Subdirektorat Perencanaan, Penempatan dan Pengembangan Pegawai",
				Icon:        "globe",
				Description: "Merancang perencanaan kebutuhan talenta, penempatan yang tepat sasaran, serta program pengembangan karir berkelanjutan.",
			},
			{
				Name:        "Subdirektorat Layanan, Pembinaan, dan Karir SDM",
				Icon:        "phone",
				Description: "Menyediakan layanan administrasi kepegawaian secara prima, pembinaan disiplin, dan bimbingan karir pegawai.",
			},
		}

		for _, sub := range subs {
			_, err := DB.Exec(ctx, "INSERT INTO subdirectorates (name, icon, description) VALUES ($1, $2, $3)", sub.Name, sub.Icon, sub.Description)
			if err != nil {
				log.Printf("Failed to seed subdirectorate %s: %v", sub.Name, err)
			}
		}
		fmt.Println("Seeded subdirectorates.")
	}

	// 3. Seed News - ensure at least 12 items
	var newsCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM news").Scan(&newsCount)
	if err != nil {
		log.Fatalf("Failed to check news count: %v", err)
	}

	if newsCount < 12 {
		newsItems := []News{
			{Title: "UI Gelar Pelatihan Anti Korupsi dalam Pengadaan Barang Jasa", Content: "PBJ merupakan salah satu area rawan praktik korupsi di sektor publik. Universitas Indonesia menggelar kegiatan Pelatihan Anti Korupsi untuk meningkatkan transparansi.", ImageURL: "/uploads/news_1.png", PublishedAt: parseDate("2026-01-20")},
			{Title: "UI Perkuat Kompetensi Pedagogik Dosen Baru melalui Pelatihan", Content: "Direktorat SDM dan Pengembangan Talenta UI mengadakan pelatihan pedagogik secara intensif bagi dosen baru guna memantapkan metode pembelajaran interaktif.", ImageURL: "/uploads/news_2.png", PublishedAt: parseDate("2026-01-19")},
			{Title: "UI dan Kementerian PKP Dorong Program Perumahan Terjangkau", Content: "Universitas Indonesia bekerja sama dengan Kementerian Perumahan dan Kawasan Permukiman (PKP) untuk melaksanakan kajian strategis dan program penyediaan perumahan terjangkau.", ImageURL: "/uploads/news_3.png", PublishedAt: parseDate("2026-01-18")},
			{Title: "DSDMPT Gelar Pleno Evaluasi Pengisian Beban Kinerja Dosen", Content: "Direktorat SDM dan Pengembangan Talenta Universitas Indonesia menggelar rapat pleno evaluasi pengisian beban kinerja dosen semester ganjil tahun akademik 2025/2026.", ImageURL: "/uploads/news_4.png", PublishedAt: parseDate("2026-01-18")},
			{Title: "Asesmen Manajerial di Pusat Administrasi Sebagai Dukungan Manajemen Talenta", Content: "DSDMPT UI melaksanakan asesmen manajerial di lingkungan Pusat Administrasi UI sebagai bagian dari program manajemen talenta untuk mengidentifikasi potensi pemimpin masa depan.", ImageURL: "/uploads/news_5.png", PublishedAt: parseDate("2026-01-17")},
			{Title: "Perumusan Peraturan Postdoctoral di Universitas Indonesia", Content: "Tim DSDMPT UI melakukan perumusan dan penyusunan peraturan Postdoctoral yang mengatur hak dan kewajiban peneliti postdoctoral.", ImageURL: "/uploads/news_1.png", PublishedAt: parseDate("2026-01-15")},
			{Title: "Workshop Jabatan Fungsional untuk Meningkatkan Kompetensi Tendik UI", Content: "DSDMPT UI menyelenggarakan workshop jabatan fungsional khusus tenaga kependidikan (Tendik) untuk meningkatkan kompetensi dan jenjang karir.", ImageURL: "/uploads/news_2.png", PublishedAt: parseDate("2026-01-14")},
			{Title: "UI Selenggarakan Workshop From Challenges to Confidence", Content: "Universitas Indonesia melalui DSDMPT menyelenggarakan workshop bertema From Challenges to Confidence yang bertujuan meningkatkan resiliensi.", ImageURL: "/uploads/news_3.png", PublishedAt: parseDate("2026-01-13")},
			{Title: "UI Perkuat Kompetensi Pedagogik Dosen Baru melalui Pelatihan Lanjutan", Content: "DSDMPT UI mengadakan sesi lanjutan pelatihan pedagogik bagi dosen baru sebagai bagian dari program orientasi.", ImageURL: "/uploads/news_4.png", PublishedAt: parseDate("2026-01-12")},
			{Title: "UI Selenggarakan Assessment Psikologis Pegawai Tidak Tetap Batch 3", Content: "Universitas Indonesia kembali menyelenggarakan assessment psikologis untuk pegawai tidak tetap (PTT) batch 3.", ImageURL: "/uploads/news_5.png", PublishedAt: parseDate("2026-01-10")},
			{Title: "Launching Program Beasiswa SDM Unggul UI Tahun 2026", Content: "DSDMPT Universitas Indonesia resmi meluncurkan Program Beasiswa SDM Unggul UI Tahun 2026.", ImageURL: "/uploads/news_1.png", PublishedAt: parseDate("2026-01-08")},
			{Title: "Sosialisasi Sistem Informasi SDM Terintegrasi Bagi Seluruh Unit Kerja", Content: "DSDMPT UI mengadakan sosialisasi sistem informasi SDM terintegrasi kepada seluruh unit kerja.", ImageURL: "/uploads/news_2.png", PublishedAt: parseDate("2026-01-06")},
			{Title: "Rapat Koordinasi DSDMPT Bersama Seluruh Kepala Subdirektorat", Content: "Direktorat SDM dan Pengembangan Talenta Universitas Indonesia mengadakan rapat koordinasi bersama seluruh Kepala Subdirektorat.", ImageURL: "/uploads/news_3.png", PublishedAt: parseDate("2026-01-04")},
		}

		for _, item := range newsItems {
			_, err := DB.Exec(ctx, `
				INSERT INTO news (title, content, image_url, published_at) 
				VALUES ($1, $2, $3, $4)
			`, item.Title, item.Content, item.ImageURL, item.PublishedAt)
			if err != nil {
				log.Printf("Failed to seed news %s: %v", item.Title, err)
			}
		}
		fmt.Println("Seeded news articles.")
	}
}

func parseDate(d string) time.Time {
	t, _ := time.Parse("2006-01-02", d)
	return t
}
