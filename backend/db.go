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

	// Program Kerja Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS program_kerja (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT NOT NULL,
			icon_name VARCHAR(100) NOT NULL
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create program_kerja table: %v", err)
	}

	// Akses Pegawai Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS akses_pegawai (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT NOT NULL,
			link VARCHAR(255) NOT NULL,
			position INT NOT NULL DEFAULT 0
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create akses_pegawai table: %v", err)
	}

	// Rekrutmen Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS rekrutmen (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			link VARCHAR(255) NOT NULL,
			position INT NOT NULL DEFAULT 0
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create rekrutmen table: %v", err)
	}

	// Pengembangan Talenta Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS pengembangan_talenta (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			organizer VARCHAR(255) NOT NULL,
			date VARCHAR(255) NOT NULL,
			time VARCHAR(255) NOT NULL,
			location VARCHAR(255) NOT NULL,
			image VARCHAR(255) NOT NULL,
			type VARCHAR(50) NOT NULL,
			agenda JSONB NOT NULL DEFAULT '[]'::jsonb,
			position INT NOT NULL DEFAULT 0
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create pengembangan_talenta table: %v", err)
	}

	_, err = DB.Exec(ctx, `
		ALTER TABLE pengembangan_talenta ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
		ALTER TABLE pengembangan_talenta ADD COLUMN IF NOT EXISTS syllabus_url VARCHAR(255) NOT NULL DEFAULT '';
		ALTER TABLE pengembangan_talenta ADD COLUMN IF NOT EXISTS registration_link VARCHAR(255) NOT NULL DEFAULT '';
		ALTER TABLE pengembangan_talenta ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(100) NOT NULL DEFAULT '';
	`)
	if err != nil {
		log.Fatalf("Failed to alter pengembangan_talenta table: %v", err)
	}

	// Informasi Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS informasi (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT NOT NULL DEFAULT '',
			image_url VARCHAR(255) NOT NULL DEFAULT '',
			file_url VARCHAR(255) NOT NULL DEFAULT '',
			position INT NOT NULL DEFAULT 0
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create informasi table: %v", err)
	}

	// Dokumen Terkini Table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS dokumen_terkini (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			file_url VARCHAR(255) NOT NULL DEFAULT '',
			link VARCHAR(255) NOT NULL DEFAULT '',
			position INT NOT NULL DEFAULT 0
		);
	`)
	if err != nil {
		log.Fatalf("Failed to create dokumen_terkini table: %v", err)
	}

	fmt.Println("Database schemas verified/created.")
}


func seedData() {
	ctx := context.Background()
	var err error

	// 1. Seed Settings (insert missing keys using ON CONFLICT DO NOTHING)
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

		"profil_hero_title": "Profil",
		"profil_hero_desc":  "",
		"profil_text_1": "Direktorat SDM dan Pengembangan Talenta adalah salah satu Direktorat yang dibawahi oleh Wakil Rektor bidang Perencanaan, Keuangan, dan SDM. Menjadikan UI sebagai Pusat Talenta terbaik merupakan sasaran strategis yang diamanahkan kepada Direktorat SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.",
		"profil_text_2": "Direktorat SDM dan Pengembangan Talenta terus memodernisasi sistem TI untuk meningkatkan kecepatan dan akurasi layanan. Langkah ini dilakukan agar Direktorat dapat berfokus penuh pada perencanaan serta pengembangan yang bersifat strategis.",
		"profil_image":  "/uploads/profile_group.jpg",

		"profil_program_kerja_subtitle": "Program kerja utama yang diamanatkan dalam rencana strategis universitas guna mendukung sasaran strategis pusat talenta terbaik adalah sebagai berikut",
		"profil_program_kerja_json": `[{"title":"Pengembangan Kapasitas","description":"Melakukan pelatihan berkala untuk membangun kapasitas dan komitmen dosen","iconName":"GraduationCap"},{"title":"Akuisisi Talenta","description":"Mengundang profesional dengan talenta terbaik dari berbagai bidang untuk","iconName":"UserPlus"},{"title":"Merit System","description":"Mengupayakan penerapan sistem merit yang objektif dalam proses rekrutmen dan","iconName":"Award"},{"title":"Optimasi Insentif","description":"Menyempurnakan kebijakan insentif untuk mendorong produktivitas dan","iconName":"Wallet"},{"title":"Jabatan Peneliti","description":"Menciptakan dan mengelola jabatan fungsional peneliti guna memperkuat ekosistem","iconName":"FlaskConical"},{"title":"Publikasi Bereputasi","description":"Meningkatkan kemampuan peneliti dalam menghasilkan publikasi berkualitas","iconName":"FileText"},{"title":"Dosen Berkualitas","description":"Meningkatkan jumlah dosen dengan kualifikasi unggul melalui program","iconName":"Star"},{"title":"Percepatan Karier","description":"Mendorong percepatan kenaikan jabatan fungsional akademik, mulai dari Lektor hingga","iconName":"TrendingUp"}]`,

		"global_talent_text_1": "<strong>Global Talent</strong> merupakan program Universitas Indonesia yang bertujuan untuk memperkuat kapasitas dan jejaring talenta akademik di tingkat internasional melalui kolaborasi, mobilitas, dan pengembangan kegiatan akademik serta riset. Program ini merupakan bagian dari upaya UI dalam meningkatkan kualitas sumber daya manusia, memperluas jejaring global, meningkatkan kualitas publikasi dan riset, serta memperkuat posisi UI sebagai universitas berkelas dunia.<br/><br/>Program Global Talent dapat melibatkan dosen, peneliti, mahasiswa pascadoktoral, dan mitra akademik dari institusi luar negeri. Bentuk kegiatannya antara lain kolaborasi riset internasional, postdoctoral researcher dari luar negeri, joint supervision, visiting professor, serta kegiatan mobilitas akademik lainnya sesuai dengan program yang tersedia di SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.",
		"global_talent_image":  "/uploads/global.jpg",
		
		"global_talent_aturan_json": `["Kegiatan dilaksanakan dalam rangka mendukung peningkatan kualitas akademik, riset, publikasi, dan jejaring internasional UI.", "Peserta atau mitra yang terlibat harus memenuhi persyaratan sesuai dengan jenis kegiatan dan ketentuan program yang berlaku.", "Kegiatan harus memiliki tujuan, luaran, dan manfaat yang jelas bagi pengembangan akademik dan/atau riset.", "Pelaksanaan kegiatan dilakukan melalui mekanisme seleksi, penetapan, serta pemantauan dan evaluasi sesuai ketentuan yang berlaku.", "Setiap peserta atau penerima program wajib melaksanakan kegiatan sesuai dengan rencana yang telah disetujui and menyampaikan laporan sesuai dengan ketentuan yang ditetapkan."]`,
		"global_talent_alur_json": `["Informasi mengenai program, jenis kegiatan, persyaratan, dan mekanisme pelaksanaan disampaikan kepada calon peserta atau pihak yang berkepentingan.", "Calon peserta, dosen, peneliti, atau unit pengusul mengajukan kegiatan atau mengidentifikasi calon mitra sesuai dengan skema program yang tersedia.", "Pengajuan dan calon peserta diverifikasi berdasarkan persyaratan, relevansi kegiatan, kompetensi, serta kesesuaian dengan tujuan program.", "Peserta, penerima program, atau mitra yang memenuhi persyaratan dan lolos seleksi ditetapkan sesuai dengan ketentuan yang berlaku.", "Kegiatan dilaksanakan sesuai dengan rencana, durasi, peran, dan tanggung jawab yang telah ditetapkan.", "Pelaksanaan kegiatan dipantau dan dievaluasi untuk memastikan kesesuaian kegiatan dengan tujuan dan target yang telah ditetapkan.", "Peserta atau pelaksana menyampaikan laporan pelaksanaan dan luaran kegiatan sesuai dengan ketentuan yang berlaku."]`,
	}

	for k, v := range defaultSettings {
		_, err := DB.Exec(ctx, `
			INSERT INTO settings (key, value) VALUES ($1, $2)
			ON CONFLICT (key) DO NOTHING
		`, k, v)
		if err != nil {
			log.Printf("Failed to seed setting key %s: %v", k, err)
		}
	}
	fmt.Println("Seeded page settings dynamically.")

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

	// 4. Seed Program Kerja matching screenshot descriptions exactly
	var pkCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM program_kerja").Scan(&pkCount)
	if err != nil {
		log.Fatalf("Failed to check program_kerja count: %v", err)
	}

	if pkCount != 8 {
		// Truncate table and re-seed to ensure clean match with the mockup screenshot
		_, _ = DB.Exec(ctx, "TRUNCATE TABLE program_kerja RESTART IDENTITY")
		
		pks := []ProgramKerja{
			{Title: "Pengembangan Kapasitas", Description: "Melakukan pelatihan berkala untuk membangun kapasitas dan komitmen dosen", IconName: "GraduationCap"},
			{Title: "Akuisisi Talenta", Description: "Mengundang profesional dengan talenta terbaik dari berbagai bidang untuk", IconName: "UserPlus"},
			{Title: "Merit System", Description: "Mengupayakan penerapan sistem merit yang objektif dalam proses rekrutmen dan", IconName: "Award"},
			{Title: "Optimasi Insentif", Description: "Menyempurnakan kebijakan insentif untuk mendorong produktivitas dan", IconName: "Wallet"},
			{Title: "Jabatan Peneliti", Description: "Menciptakan dan mengelola jabatan fungsional peneliti guna memperkuat ekosistem", IconName: "FlaskConical"},
			{Title: "Publikasi Bereputasi", Description: "Meningkatkan kemampuan peneliti dalam menghasilkan publikasi berkualitas", IconName: "FileText"},
			{Title: "Dosen Berkualitas", Description: "Meningkatkan jumlah dosen dengan kualifikasi unggul melalui program", IconName: "Star"},
			{Title: "Percepatan Karier", Description: "Mendorong percepatan kenaikan jabatan fungsional akademik, mulai dari Lektor hingga", IconName: "TrendingUp"},
		}

		for _, pk := range pks {
			_, err := DB.Exec(ctx, "INSERT INTO program_kerja (title, description, icon_name) VALUES ($1, $2, $3)", pk.Title, pk.Description, pk.IconName)
			if err != nil {
				log.Printf("Failed to seed program_kerja %s: %v", pk.Title, err)
			}
		}
		fmt.Println("Seeded program_kerja table matching mockup screenshot.")
	}

	// 5. Seed Akses Pegawai if empty
	var apCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM akses_pegawai").Scan(&apCount)
	if err != nil {
		log.Fatalf("Failed to check akses_pegawai count: %v", err)
	}

	if apCount == 0 {
		aps := []struct {
			Title       string
			Description string
			Link        string
			Position    int
		}{
			{
				Title:       "Izin PDLN",
				Description: "Layanan permohonan izin perjalanan dinas luar negeri bagi pegawai.",
				Link:        "https://script.google.com/macros/s/AKfycbw7CdgMgY293NveC9b4B96d8yeqZDwCIU-ywVLBr14iNJYbLQRsRufUeYfFTV5qvS_I/exec",
				Position:    1,
			},
			{
				Title:       "HRIS",
				Description: "Sistem informasi terintegrasi untuk manajemen data sumber daya manusia.",
				Link:        "https://hris.ui.ac.id/",
				Position:    2,
			},
			{
				Title:       "SIPEG",
				Description: "Portal pelayanan administrasi kepegawaian internal.",
				Link:        "https://sipeg.ui.ac.id/ng/otorisasi",
				Position:    3,
			},
			{
				Title:       "SISTER",
				Description: "Layanan administrasi dan pemutakhiran data pendidik maupun tenaga kependidikan.",
				Link:        "https://sister.kemdiktisaintek.go.id/beranda",
				Position:    4,
			},
			{
				Title:       "STELLAR-BKD",
				Description: "Platform pengembangan talenta dan manajemen kinerja pegawai.",
				Link:        "https://stellar-dsdm.ui.ac.id/",
				Position:    5,
			},
			{
				Title:       "STELLAR-Executive",
				Description: "Sistem Terpadu Laporan & Layanan Aktivitas Rekapitulasi Data Pegawai Tendik dan Dosen.",
				Link:        "https://stellar-dsdm.ui.ac.id/",
				Position:    6,
			},
		}

		for _, ap := range aps {
			_, err := DB.Exec(ctx, "INSERT INTO akses_pegawai (title, description, link, position) VALUES ($1, $2, $3, $4)", ap.Title, ap.Description, ap.Link, ap.Position)
			if err != nil {
				log.Printf("Failed to seed akses_pegawai %s: %v", ap.Title, err)
			}
		}
		fmt.Println("Seeded akses_pegawai table.")
	}

	// 6. Seed Rekrutmen if empty
	var recCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM rekrutmen").Scan(&recCount)
	if err != nil {
		recCount = 0
	}
	if recCount == 0 {
		recs := []struct {
			Title    string
			Link     string
			Position int
		}{
			{
				Title:    "Portal Rekrutmen Utama Universitas Indonesia",
				Link:     "https://recruitment.ui.ac.id",
				Position: 1,
			},
			{
				Title:    "Rekrutmen Calon Dosen Tetap UI",
				Link:     "https://recruitment.ui.ac.id",
				Position: 2,
			},
			{
				Title:    "Rekrutmen Tenaga Kependidikan (Tendik) UI",
				Link:     "https://recruitment.ui.ac.id",
				Position: 3,
			},
		}
		for _, rec := range recs {
			_, err := DB.Exec(ctx, "INSERT INTO rekrutmen (title, link, position) VALUES ($1, $2, $3)", rec.Title, rec.Link, rec.Position)
			if err != nil {
				log.Printf("Failed to seed rekrutmen %s: %v", rec.Title, err)
			}
		}
		fmt.Println("Seeded rekrutmen table.")
	}

	// 7. Seed Pengembangan Talenta if empty
	var ptCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM pengembangan_talenta").Scan(&ptCount)
	if err != nil {
		ptCount = 0
	}
	if ptCount == 0 {
		pts := []struct {
			Title     string
			Organizer string
			Date      string
			Time      string
			Location  string
			Image     string
			Type      string
			Agenda    string
			Position  int
		}{
			{
				Title:     "Pelatihan Kepemimpinan Universitas",
				Organizer: "DSDMPT Universitas Indonesia",
				Date:      "15 Maret 2026",
				Time:      "08:00 - 16:00 WIB",
				Location:  "Gedung Rektorat Lt. 5",
				Image:     "/uploads/talent_1.jpg",
				Type:      "internal",
				Agenda:    `[{"time":"08:00 - 10:00","activity":"Sesi 1: Dasar Kepemimpinan Strategis di Lingkungan UI"},{"time":"10:30 - 12:30","activity":"Sesi 2: Workshop Tata Kelola Talenta DSDMPT"},{"time":"13:30 - 15:30","activity":"Sesi 3: Panel Diskusi Strategi Pengembangan Karier"},{"time":"15:30 - 16:00","activity":"Penutup & Networking"}]`,
				Position:  1,
			},
			{
				Title:     "Pengembangan Kompetensi Pedagogik",
				Organizer: "Direktorat Pendidikan",
				Date:      "22 April 2026",
				Time:      "08:30 - 15:30 WIB",
				Location:  "Auditorium",
				Image:     "/uploads/talent_2.jpg",
				Type:      "internal",
				Agenda:    `[{"time":"08:30 - 10:30","activity":"Sesi 1: Pengantar Metode Pembelajaran Interaktif"},{"time":"11:00 - 13:00","activity":"Sesi 2: Penyusunan Kurikulum Berbasis OBE"},{"time":"14:00 - 15:30","activity":"Sesi 3: Praktik & Evaluasi Pedagogik"}]`,
				Position:  2,
			},
			{
				Title:     "Manajemen Karir Tendik",
				Organizer: "Pusat Sistem Informasi",
				Date:      "22 Juni 2026",
				Time:      "09:00 - 15:00 WIB",
				Location:  "Lab Komputer Terpadu",
				Image:     "/uploads/talent_3.jpg",
				Type:      "internal",
				Agenda:    `[{"time":"09:00 - 11:00","activity":"Sesi 1: Perencanaan Karir Staf Kependidikan"},{"time":"11:30 - 13:30","activity":"Sesi 2: Sertifikasi & Portofolio Profesional"},{"time":"14:00 - 15:00","activity":"Sesi 3: Tanya Jawab Jalur Fungsional"}]`,
				Position:  3,
			},
			{
				Title:     "Sertifikasi Kompetensi Global",
				Organizer: "DSDMPT Universitas Indonesia",
				Date:      "12 Juli 2026",
				Time:      "08:00 - 17:00 WIB",
				Location:  "Ruang Rapat Utama",
				Image:     "/uploads/talent_4.jpg",
				Type:      "public",
				Agenda:    `[{"time":"08:00 - 10:00","activity":"Sesi 1: Standarisasi Sertifikasi Global"},{"time":"10:30 - 12:30","activity":"Sesi 2: Pembahasan Ujian & Persiapan"},{"time":"13:30 - 16:30","activity":"Sesi 3: Simulasi Ujian Sertifikasi"},{"time":"16:30 - 17:00","activity":"Penutup & Pengumuman Hasil"}]`,
				Position:  4,
			},
			{
				Title:     "Literasi Digital Administrasi",
				Organizer: "Biro Komunikasi",
				Date:      "18 Agustus 2026",
				Time:      "08:00 - 15:00 WIB",
				Location:  "Gedung IASTH Lt.3",
				Image:     "/uploads/talent_2.jpg",
				Type:      "public",
				Agenda:    `[{"time":"08:00 - 10:00","activity":"Sesi 1: Keamanan Informasi Administrasi"},{"time":"10:30 - 12:30","activity":"Sesi 2: Otomasi Dokumen & Surat Digital"},{"time":"13:30 - 15:00","activity":"Sesi 3: Kolaborasi Cloud dalam Tim Kerja"}]`,
				Position:  5,
			},
			{
				Title:     "Pelatihan Komunikasi Efektif",
				Organizer: "DSDMPT Universitas Indonesia",
				Date:      "18 Agustus 2026",
				Time:      "09:00 - 16:00 WIB",
				Location:  "Balai Sidang UI",
				Image:     "/uploads/talent_1.jpg",
				Type:      "public",
				Agenda:    `[{"time":"09:00 - 11:00","activity":"Sesi 1: Teknik Komunikasi Asertif"},{"time":"11:30 - 13:30","activity":"Sesi 2: Public Speaking & Presentasi Efektif"},{"time":"14:30 - 16:00","activity":"Sesi 3: Manajemen Konflik & Komunikasi Tim"}]`,
				Position:  6,
			},
		}
		for _, pt := range pts {
			_, err := DB.Exec(ctx, "INSERT INTO pengembangan_talenta (title, organizer, date, time, location, image, type, agenda, position) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)", pt.Title, pt.Organizer, pt.Date, pt.Time, pt.Location, pt.Image, pt.Type, pt.Agenda, pt.Position)
			if err != nil {
				log.Printf("Failed to seed pengembangan_talenta %s: %v", pt.Title, err)
			}
		}
		fmt.Println("Seeded pengembangan_talenta table.")
	}

	// 8. Seed Informasi if empty
	var infoCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM informasi").Scan(&infoCount)
	if err != nil {
		infoCount = 0
	}
	if infoCount == 0 {
		infos := []Informasi{
			{
				Title:       "Jadwal Pengisian BKD",
				Description: "",
				ImageURL:    "/uploads/jadwal_bkd.png",
				FileURL:     "",
				Position:    1,
			},
			{
				Title:       "9 Nilai Dasar Universitas Indonesia",
				Description: "Demi Mewujudkan Visi, Universitas Indonesia Miliki 9 Nilai Dasar. Sesuai dengan fungsi universalnya sebagai rumah dan lumbung pengetahuan, teladan, dan kekuatan moral bagi masyarakat, Universitas Indonesia (UI) memiliki nilai-nilai dasar yang harus dijunjung tinggi oleh para sivitas-nya.",
				ImageURL:    "",
				FileURL:     "/uploads/buku_saku_9_nilai_ui.pdf",
				Position:    2,
			},
		}
		for _, info := range infos {
			_, err := DB.Exec(ctx, "INSERT INTO informasi (title, description, image_url, file_url, position) VALUES ($1, $2, $3, $4, $5)", info.Title, info.Description, info.ImageURL, info.FileURL, info.Position)
			if err != nil {
				log.Printf("Failed to seed informasi %s: %v", info.Title, err)
			}
		}
		fmt.Println("Seeded informasi table.")
	}

	// 9. Seed Dokumen Terkini if empty
	var docCount int
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM dokumen_terkini").Scan(&docCount)
	if err != nil {
		docCount = 0
	}
	if docCount == 0 {
		docs := []DokumenTerkini{
			{
				Title:    "Surat Edaran Libur Nasional 2026",
				FileURL:  "/uploads/buku_saku_9_nilai_ui.pdf",
				Link:     "",
				Position: 1,
			},
			{
				Title:    "Pedoman Evaluasi Kinerja Pegawai",
				FileURL:  "/uploads/buku_saku_9_nilai_ui.pdf",
				Link:     "",
				Position: 2,
			},
			{
				Title:    "Kalender Akademik & Kepegawaian",
				FileURL:  "/uploads/buku_saku_9_nilai_ui.pdf",
				Link:     "",
				Position: 3,
			},
		}
		for _, doc := range docs {
			_, err := DB.Exec(ctx, "INSERT INTO dokumen_terkini (title, file_url, link, position) VALUES ($1, $2, $3, $4)", doc.Title, doc.FileURL, doc.Link, doc.Position)
			if err != nil {
				log.Printf("Failed to seed dokumen_terkini %s: %v", doc.Title, err)
			}
		}
		fmt.Println("Seeded dokumen_terkini table.")
	}
}

func parseDate(d string) time.Time {
	t, _ := time.Parse("2006-01-02", d)
	return t
}
