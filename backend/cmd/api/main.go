package main

import (
	"fmt"
	"log"
	"time"

	"dsdmpt-backend/config"
	"dsdmpt-backend/internal/core/middleware"
	"dsdmpt-backend/internal/module/dsdmpt/entity"
	"dsdmpt-backend/internal/module/dsdmpt/handler"
	"dsdmpt-backend/internal/module/dsdmpt/repository"
	"dsdmpt-backend/internal/module/dsdmpt/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Load Configuration
	cfg := config.LoadConfig()

	// 2. Database Connection
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Connect to BKD database (bkd_db) on the same Postgres host
	bkdDsn := fmt.Sprintf("host=%s user=%s password=%s dbname=bkd_db port=%s sslmode=disable TimeZone=Asia/Jakarta",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBPort)
	bkdDb, errBkd := gorm.Open(postgres.Open(bkdDsn), &gorm.Config{})
	if errBkd != nil {
		log.Println("Warning: Failed to connect to BKD database:", errBkd)
	}


	// 3. Auto Migrate Tables
	entities := []interface{}{
		&entity.News{},
		&entity.Subdirectorate{},
		&entity.Setting{},
		&entity.User{},
		&entity.ProgramKerja{},
		&entity.AksesPegawai{},
		&entity.Rekrutmen{},
		&entity.PengembanganTalenta{},
		&entity.Informasi{},
		&entity.DokumenTerkini{},
		&entity.Statistik{},
	}

	for _, e := range entities {
		if err := db.AutoMigrate(e); err != nil {
			log.Printf("Warning: Failed to migrate %T: %v", e, err)
		}
	}

	// 4. Seed Data
	seedData(db)

	// 5. Initialize Repositories
	newsRepo := repository.NewNewsRepository(db)
	subRepo := repository.NewSubdirectorateRepository(db)
	settingRepo := repository.NewSettingRepository(db)
	userRepo := repository.NewUserRepository(db)
	pkRepo := repository.NewProgramKerjaRepository(db)
	apRepo := repository.NewAksesPegawaiRepository(db)
	recRepo := repository.NewRekrutmenRepository(db)
	ptRepo := repository.NewPengembanganTalentaRepository(db)
	infoRepo := repository.NewInformasiRepository(db)
	docRepo := repository.NewDokumenTerkiniRepository(db)
	statRepo := repository.NewStatistikRepository(db)

	// 6. Initialize Services
	newsSvc := service.NewNewsService(newsRepo)
	subSvc := service.NewSubdirectorateService(subRepo)
	settingSvc := service.NewSettingService(settingRepo)
	userSvc := service.NewUserService(userRepo)
	pkSvc := service.NewProgramKerjaService(pkRepo)
	apSvc := service.NewAksesPegawaiService(apRepo)
	recSvc := service.NewRekrutmenService(recRepo)
	ptSvc := service.NewPengembanganTalentaService(ptRepo)
	infoSvc := service.NewInformasiService(infoRepo)
	docSvc := service.NewDokumenTerkiniService(docRepo)
	statSvc := service.NewStatistikService(statRepo)

	// 7. Initialize Handlers
	authHandler := handler.NewAuthHandler(userSvc, cfg.JWTSecret)
	newsHandler := handler.NewNewsHandler(newsSvc)
	subHandler := handler.NewSubdirectorateHandler(subSvc)
	settingHandler := handler.NewSettingHandler(settingSvc)
	userHandler := handler.NewUserHandler(userSvc)
	pkHandler := handler.NewProgramKerjaHandler(pkSvc)
	apHandler := handler.NewAksesPegawaiHandler(apSvc)
	recHandler := handler.NewRekrutmenHandler(recSvc)
	ptHandler := handler.NewPengembanganTalentaHandler(ptSvc)
	infoHandler := handler.NewInformasiHandler(infoSvc)
	docHandler := handler.NewDokumenTerkiniHandler(docSvc)
	uploadHandler := handler.NewUploadHandler()
	statHandler := handler.NewStatistikHandler(statSvc, bkdDb)


	// 8. Setup Router & CORS
	r := gin.Default()
	r.MaxMultipartMemory = 50 << 20 // 50 MB limit
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:    []string{"Origin", "Content-Type", "Authorization"},
	}))

	// Static routes
	r.Static("/uploads", "./uploads")

	// 9. Register Routes
	api := r.Group("/api")
	{
		// Public routes
		api.POST("/auth/login", authHandler.Login)
		api.GET("/news", newsHandler.GetNews)
		api.GET("/news/:idOrSlug", newsHandler.GetNewsDetail)
		api.GET("/subdirectorates", subHandler.GetSubdirectorates)
		api.GET("/settings", settingHandler.GetSettings)
		api.GET("/program-kerja", pkHandler.List)
		api.GET("/akses-pegawai", apHandler.List)
		api.GET("/rekrutmen", recHandler.List)
		api.GET("/pengembangan-talenta", ptHandler.List)
		api.GET("/pengembangan-talenta/:idOrSlug", ptHandler.Detail)
		api.GET("/informasi", infoHandler.List)
		api.GET("/dokumen-terkini", docHandler.List)
		api.GET("/statistik", statHandler.GetStatistik)

		
		// Global Search Endpoint
		api.GET("/search", func(c *gin.Context) {
			q := c.Query("q")
			if q == "" {
				c.JSON(200, gin.H{
					"news":       []interface{}{},
					"talenta":    []interface{}{},
					"informasi":  []interface{}{},
				})
				return
			}
			
			likeQuery := "%" + q + "%"
			
			var news []entity.News
			db.Where("title LIKE ? OR content LIKE ?", likeQuery, likeQuery).Limit(10).Find(&news)
			
			var talenta []entity.PengembanganTalenta
			db.Where("title LIKE ? OR description LIKE ? OR organizer LIKE ?", likeQuery, likeQuery, likeQuery).Limit(10).Find(&talenta)
			
			var info []entity.Informasi
			db.Where("title LIKE ? OR description LIKE ?", likeQuery, likeQuery).Limit(10).Find(&info)
			
			c.JSON(200, gin.H{
				"news":       news,
				"talenta":    talenta,
				"informasi":  info,
			})
		})

		// Protected Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(cfg.JWTSecret))
		{
			admin.PUT("/settings", settingHandler.UpdateSettings)
			admin.POST("/upload", uploadHandler.Upload)
			
			admin.GET("/users", userHandler.UsersList)
			admin.POST("/users", userHandler.UserCreate)
			admin.PUT("/users/:id", userHandler.UserUpdate)
			admin.DELETE("/users/:id", userHandler.UserDelete)

			admin.GET("/news", newsHandler.AdminNewsList)
			admin.POST("/news", newsHandler.AdminNewsCreate)
			admin.PUT("/news/:id", newsHandler.AdminNewsUpdate)
			admin.DELETE("/news/:id", newsHandler.AdminNewsDelete)

			admin.GET("/program-kerja", pkHandler.AdminList)
			admin.POST("/program-kerja", pkHandler.AdminCreate)
			admin.PUT("/program-kerja/:id", pkHandler.AdminUpdate)
			admin.DELETE("/program-kerja/:id", pkHandler.AdminDelete)

			admin.GET("/akses-pegawai", apHandler.AdminList)
			admin.POST("/akses-pegawai", apHandler.AdminCreate)
			admin.PUT("/akses-pegawai/:id", apHandler.AdminUpdate)
			admin.DELETE("/akses-pegawai/:id", apHandler.AdminDelete)
			admin.POST("/akses-pegawai/reorder", apHandler.AdminReorder)

			admin.GET("/rekrutmen", recHandler.AdminList)
			admin.POST("/rekrutmen", recHandler.AdminCreate)
			admin.PUT("/rekrutmen/:id", recHandler.AdminUpdate)
			admin.DELETE("/rekrutmen/:id", recHandler.AdminDelete)
			admin.POST("/rekrutmen/reorder", recHandler.AdminReorder)

			admin.GET("/pengembangan-talenta", ptHandler.AdminList)
			admin.POST("/pengembangan-talenta", ptHandler.AdminCreate)
			admin.PUT("/pengembangan-talenta/:id", ptHandler.AdminUpdate)
			admin.DELETE("/pengembangan-talenta/:id", ptHandler.AdminDelete)
			admin.POST("/pengembangan-talenta/reorder", ptHandler.AdminReorder)

			admin.GET("/informasi", infoHandler.AdminList)
			admin.POST("/informasi", infoHandler.AdminCreate)
			admin.PUT("/informasi/:id", infoHandler.AdminUpdate)
			admin.DELETE("/informasi/:id", infoHandler.AdminDelete)
			admin.POST("/informasi/reorder", infoHandler.AdminReorder)

			admin.GET("/dokumen-terkini", docHandler.AdminList)
			admin.POST("/dokumen-terkini", docHandler.AdminCreate)
			admin.PUT("/dokumen-terkini/:id", docHandler.AdminUpdate)
			admin.DELETE("/dokumen-terkini/:id", docHandler.AdminDelete)
			admin.POST("/dokumen-terkini/reorder", docHandler.AdminReorder)

			admin.GET("/statistik", statHandler.GetStatistik)
			admin.POST("/statistik/sync", statHandler.Sync)
		}
	}

	fmt.Printf("Server starting on http://localhost:%s...\n", cfg.Port)
	log.Fatal(r.Run(":" + cfg.Port))
}

func seedData(db *gorm.DB) {
	// 1. Seed Settings
	var count int64
	db.Model(&entity.Setting{}).Count(&count)
	if count == 0 {
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

			"global_talent_text_1": "<strong>Global Talent</strong> merupakan program Universitas Indonesia yang bertujuan untuk memperkuat kapasitas dan jejaring talenta akademik di tingkat internasional melalui kolaborasi, mobilitas, dan pengembangan kegiatan akademik serta riset. Program ini merupakan bagian dari upaya UI dalam meningkatkan kualitas sumber daya manusia, memperluas jejaring global, meningkatkan kualitas publikasi and riset, serta memperkuat posisi UI sebagai universitas berkelas dunia.<br/><br/>Program Global Talent dapat melibatkan dosen, peneliti, mahasiswa pascadoktoral, dan mitra akademik dari institusi luar negeri. Bentuk kegiatannya antara lain kolaborasi riset internasional, postdoctoral researcher dari luar negeri, joint supervision, visiting professor, serta kegiatan mobilitas akademik lainnya sesuai dengan program yang tersedia di SDM dan Pengembangan Talenta sebagaimana tertuang dalam Rencana Strategis (Renstra) Universitas Indonesia tahun 2024-2029.",
			"global_talent_image":  "/uploads/global.jpg",
			
			"global_talent_aturan_json": `["Kegiatan dilaksanakan dalam rangka mendukung peningkatan kualitas akademik, riset, publikasi, dan jejaring internasional UI.", "Peserta atau mitra yang terlibat harus memenuhi persyaratan sesuai dengan jenis kegiatan dan ketentuan program yang berlaku.", "Kegiatan harus memiliki tujuan, luaran, dan manfaat yang jelas bagi pengembangan akademik dan/atau riset.", "Pelaksanaan kegiatan dilakukan melalui mekanisme seleksi, penetapan, serta pemantauan dan evaluasi sesuai ketentuan yang berlaku.", "Setiap peserta atau penerima program wajib melaksanakan kegiatan sesuai dengan rencana yang telah disetujui and menyampaikan laporan sesuai dengan ketentuan yang ditetapkan."]`,
			"global_talent_alur_json": `["Informasi mengenai program, jenis kegiatan, persyaratan, dan mekanisme pelaksanaan disampaikan kepada calon peserta atau pihak yang berkepentingan.", "Calon peserta, dosen, peneliti, atau unit pengusul mengajukan kegiatan atau mengidentifikasi calon mitra sesuai dengan skema program yang tersedia.", "Pengajuan dan calon peserta diverifikasi berdasarkan persyaratan, relevansi kegiatan, kompetensi, serta kesesuaian dengan tujuan program.", "Peserta, penerima program, atau mitra yang memenuhi persyaratan dan lolos seleksi ditetapkan sesuai dengan ketentuan yang berlaku.", "Kegiatan dilaksanakan sesuai dengan rencana, durasi, peran, dan tanggung jawab yang telah ditetapkan.", "Pelaksanaan kegiatan dipantau dan dievaluasi untuk memastikan kesesuaian kegiatan dengan tujuan dan target yang telah ditetapkan.", "Peserta atau pelaksana menyampaikan laporan pelaksanaan dan luaran kegiatan sesuai dengan ketentuan yang berlaku."]`,
		}
		for k, v := range defaultSettings {
			db.Create(&entity.Setting{Key: k, Value: v})
		}
		fmt.Println("Seeded settings successfully.")
	}

	// 2. Seed Subdirectorates
	db.Model(&entity.Subdirectorate{}).Count(&count)
	if count == 0 {
		subs := []entity.Subdirectorate{
			{Name: "Subdirektorat Pengembangan Organisasi dan Sistem SDM", Icon: "people", Description: "Fokus pada pengembangan struktur organisasi yang adaptif serta implementasi sistem manajemen SDM terintegrasi."},
			{Name: "Subdirektorat Remunerasi dan Kesejahteraan Pegawai", Icon: "user", Description: "Mengelola kebijakan kompensasi, tunjangan, dan program kesejahteraan guna meningkatkan motivasi pegawai."},
			{Name: "Subdirektorat Perencanaan, Penempatan dan Pengembangan Pegawai", Icon: "globe", Description: "Merancang perencanaan kebutuhan talenta, penempatan yang tepat sasaran, serta program pengembangan karir berkelanjutan."},
			{Name: "Subdirektorat Layanan, Pembinaan, dan Karir SDM", Icon: "phone", Description: "Menyediakan layanan administrasi kepegawaian secara prima, pembinaan disiplin, dan bimbingan karir pegawai."},
		}
		for _, s := range subs {
			db.Create(&s)
		}
		fmt.Println("Seeded subdirectorates successfully.")
	}

	// 3. Seed News
	db.Model(&entity.News{}).Count(&count)
	if count < 12 {
		newsItems := []entity.News{
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
		for _, n := range newsItems {
			db.Create(&n)
		}
		fmt.Println("Seeded news articles successfully.")
	}

	// 4. Seed Program Kerja
	db.Model(&entity.ProgramKerja{}).Count(&count)
	if count == 0 {
		pks := []entity.ProgramKerja{
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
			db.Create(&pk)
		}
		fmt.Println("Seeded program_kerja successfully.")
	}

	// 5. Seed Akses Pegawai
	db.Model(&entity.AksesPegawai{}).Count(&count)
	if count == 0 {
		aps := []entity.AksesPegawai{
			{Title: "Izin PDLN", Description: "Layanan permohonan izin perjalanan dinas luar negeri bagi pegawai.", Link: "https://script.google.com/macros/s/AKfycbw7CdgMgY293NveC9b4B96d8yeqZDwCIU-ywVLBr14iNJYbLQRsRufUeYfFTV5qvS_I/exec", Position: 1},
			{Title: "HRIS", Description: "Sistem informasi terintegrasi untuk manajemen data sumber daya manusia.", Link: "https://hris.ui.ac.id/", Position: 2},
			{Title: "SIPEG", Description: "Portal pelayanan administrasi kepegawaian internal.", Link: "https://sipeg.ui.ac.id/ng/otorisasi", Position: 3},
			{Title: "SISTER", Description: "Layanan administrasi dan pemutakhiran data pendidik maupun tenaga kependidikan.", Link: "https://sister.kemdiktisaintek.go.id/beranda", Position: 4},
			{Title: "STELLAR-BKD", Description: "Platform pengembangan talenta dan manajemen kinerja pegawai.", Link: "https://stellar-dsdm.ui.ac.id/", Position: 5},
			{Title: "STELLAR-Executive", Description: "Sistem Terpadu Laporan & Layanan Aktivitas Rekapitulasi Data Pegawai Tendik dan Dosen.", Link: "https://stellar-dsdm.ui.ac.id/", Position: 6},
		}
		for _, ap := range aps {
			db.Create(&ap)
		}
		fmt.Println("Seeded akses_pegawai successfully.")
	}

	// 6. Seed Rekrutmen
	db.Model(&entity.Rekrutmen{}).Count(&count)
	if count == 0 {
		recs := []entity.Rekrutmen{
			{Title: "Portal Rekrutmen Utama Universitas Indonesia", Link: "https://recruitment.ui.ac.id", Position: 1},
			{Title: "Rekrutmen Calon Dosen Tetap UI", Link: "https://recruitment.ui.ac.id", Position: 2},
			{Title: "Rekrutmen Tenaga Kependidikan (Tendik) UI", Link: "https://recruitment.ui.ac.id", Position: 3},
		}
		for _, rec := range recs {
			db.Create(&rec)
		}
		fmt.Println("Seeded rekrutmen successfully.")
	}

	// 7. Seed Pengembangan Talenta
	db.Model(&entity.PengembanganTalenta{}).Count(&count)
	if count == 0 {
		pts := []entity.PengembanganTalenta{
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
			db.Create(&pt)
		}
		fmt.Println("Seeded pengembangan_talenta successfully.")
	}

	// 8. Seed Informasi
	db.Model(&entity.Informasi{}).Count(&count)
	if count == 0 {
		infos := []entity.Informasi{
			{Title: "Jadwal Pengisian BKD", ImageURL: "/uploads/jadwal_bkd.png", Position: 1},
			{Title: "9 Nilai Dasar Universitas Indonesia", Description: "Demi Mewujudkan Visi, Universitas Indonesia Miliki 9 Nilai Dasar. Sesuai dengan fungsi universalnya sebagai rumah dan lumbung pengetahuan, teladan, dan kekuatan moral bagi masyarakat, Universitas Indonesia (UI) memiliki nilai-nilai dasar yang harus dijunjung tinggi oleh para sivitas-nya.", FileURL: "/uploads/buku_saku_9_nilai_ui.pdf", Position: 2},
		}
		for _, info := range infos {
			db.Create(&info)
		}
		fmt.Println("Seeded informasi successfully.")
	}

	// 9. Seed Dokumen Terkini
	db.Model(&entity.DokumenTerkini{}).Count(&count)
	if count == 0 {
		docs := []entity.DokumenTerkini{
			{Title: "Surat Edaran Libur Nasional 2026", FileURL: "/uploads/buku_saku_9_nilai_ui.pdf", Position: 1},
			{Title: "Pedoman Evaluasi Kinerja Pegawai", FileURL: "/uploads/buku_saku_9_nilai_ui.pdf", Position: 2},
			{Title: "Kalender Akademik & Kepegawaian", FileURL: "/uploads/buku_saku_9_nilai_ui.pdf", Position: 3},
		}
		for _, doc := range docs {
			db.Create(&doc)
		}
		fmt.Println("Seeded dokumen_terkini successfully.")
	}

	// 10. Seed Default Admin User if empty
	db.Model(&entity.User{}).Count(&count)
	if count == 0 {
		hashed, _ := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
		defaultUser := entity.User{
			Username:  "admin",
			Password:  string(hashed),
			Name:      "Administrator DSDMPT",
			Email:     "admin@dsdmpt.ui.ac.id",
			Role:      "admin",
			CreatedAt: time.Now(),
		}
		db.Create(&defaultUser)
		fmt.Println("Seeded default admin user (admin / admin) successfully.")
	}

	// 11. Seed default Statistik if empty
	db.Model(&entity.Statistik{}).Count(&count)
	if count == 0 {
		defaultStats := []entity.Statistik{
			// Dosen
			{Kategori: "dosen", UnitName: "Fakultas Kedokteran", UnitShort: "FK", Pns: 170, TetapNonPns: 125, Nidk: 342, Total: 637, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Kedokteran Gigi", UnitShort: "FKG", Pns: 42, TetapNonPns: 31, Nidk: 53, Total: 126, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Matematika dan Ilmu Pengetahuan Alam", UnitShort: "FMIPA", Pns: 110, TetapNonPns: 80, Nidk: 45, Total: 235, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Teknik", UnitShort: "FT", Pns: 150, TetapNonPns: 110, Nidk: 65, Total: 325, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Hukum", UnitShort: "FH", Pns: 65, TetapNonPns: 48, Nidk: 24, Total: 137, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Ekonomi dan Bisnis", UnitShort: "FEB", Pns: 130, TetapNonPns: 95, Nidk: 70, Total: 295, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Ilmu Pengetahuan Budaya", UnitShort: "FIB", Pns: 85, TetapNonPns: 62, Nidk: 30, Total: 177, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Psikologi", UnitShort: "FPsi", Pns: 45, TetapNonPns: 33, Nidk: 18, Total: 96, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Ilmu Sosial dan Politik", UnitShort: "FISIP", Pns: 95, TetapNonPns: 70, Nidk: 40, Total: 205, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Kesehatan Masyarakat", UnitShort: "FKM", Pns: 55, TetapNonPns: 40, Nidk: 22, Total: 117, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Ilmu Komputer", UnitShort: "FASILKOM", Pns: 52, TetapNonPns: 38, Nidk: 20, Total: 110, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Ilmu Keperawatan", UnitShort: "FIK", Pns: 35, TetapNonPns: 26, Nidk: 15, Total: 76, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Program Pendidikan Vokasi", UnitShort: "VOKASI", Pns: 25, TetapNonPns: 18, Nidk: 10, Total: 53, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Farmasi", UnitShort: "FF", Pns: 30, TetapNonPns: 22, Nidk: 12, Total: 64, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Fakultas Ilmu Administrasi", UnitShort: "FIA", Pns: 28, TetapNonPns: 20, Nidk: 11, Total: 59, UpdatedAt: time.Now()},
			{Kategori: "dosen", UnitName: "Sekolah Pascasarjana Pembangunan Berkelanjutan", UnitShort: "SPPB", Pns: 12, TetapNonPns: 9, Nidk: 5, Total: 26, UpdatedAt: time.Now()},

			// Tendik
			{Kategori: "tendik", UnitName: "FK", UnitShort: "FK", Pns: 85, TetapNonPns: 240, Nidk: 0, Total: 325, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FKG", UnitShort: "FKG", Pns: 22, TetapNonPns: 60, Nidk: 0, Total: 82, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FMIPA", UnitShort: "FMIPA", Pns: 45, TetapNonPns: 120, Nidk: 0, Total: 165, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FT", UnitShort: "FT", Pns: 70, TetapNonPns: 180, Nidk: 0, Total: 250, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FH", UnitShort: "FH", Pns: 30, TetapNonPns: 80, Nidk: 0, Total: 110, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FEB", UnitShort: "FEB", Pns: 60, TetapNonPns: 150, Nidk: 0, Total: 210, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FIB", UnitShort: "FIB", Pns: 40, TetapNonPns: 110, Nidk: 0, Total: 150, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FPsi", UnitShort: "FPsi", Pns: 20, TetapNonPns: 50, Nidk: 0, Total: 70, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FISIP", UnitShort: "FISIP", Pns: 45, TetapNonPns: 120, Nidk: 0, Total: 165, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FKM", UnitShort: "FKM", Pns: 25, TetapNonPns: 70, Nidk: 0, Total: 95, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FASILKOM", UnitShort: "FASILKOM", Pns: 24, TetapNonPns: 65, Nidk: 0, Total: 89, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FIK", UnitShort: "FIK", Pns: 16, TetapNonPns: 45, Nidk: 0, Total: 61, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "PAU", UnitShort: "PAU", Pns: 110, TetapNonPns: 300, Nidk: 0, Total: 410, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "VOKASI", UnitShort: "VOKASI", Pns: 12, TetapNonPns: 35, Nidk: 0, Total: 47, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FF", UnitShort: "FF", Pns: 15, TetapNonPns: 40, Nidk: 0, Total: 55, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "FIA", UnitShort: "FIA", Pns: 14, TetapNonPns: 38, Nidk: 0, Total: 52, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "SPPB", UnitShort: "SPPB", Pns: 6, TetapNonPns: 18, Nidk: 0, Total: 24, UpdatedAt: time.Now()},
			{Kategori: "tendik", UnitName: "RIK", UnitShort: "RIK", Pns: 8, TetapNonPns: 22, Nidk: 0, Total: 30, UpdatedAt: time.Now()},
		}
		for _, s := range defaultStats {
			db.Create(&s)
		}
		fmt.Println("Seeded default statistik data successfully.")
	}
}

func parseDate(d string) time.Time {
	t, _ := time.Parse("2006-01-02", d)
	return t
}
