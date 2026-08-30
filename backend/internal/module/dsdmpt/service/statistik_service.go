package service

import (
	"dsdmpt-backend/internal/module/dsdmpt/entity"
	"dsdmpt-backend/internal/module/dsdmpt/repository"
	"strings"
	"time"

	"gorm.io/gorm"
)

type StatistikService interface {
	GetStatistik() ([]entity.Statistik, time.Time, error)
	SyncFromBkd(bkdDb *gorm.DB) ([]entity.Statistik, time.Time, error)
}

type statistikService struct {
	repo repository.StatistikRepository
}

func NewStatistikService(repo repository.StatistikRepository) StatistikService {
	return &statistikService{repo: repo}
}

func (s *statistikService) GetStatistik() ([]entity.Statistik, time.Time, error) {
	list, err := s.repo.GetAll()
	if err != nil {
		return nil, time.Time{}, err
	}
	lastUpdated, err := s.repo.GetLastUpdated()
	return list, lastUpdated, err
}

type BKDPegawai struct {
	Kategori     *string `gorm:"column:kategori"`
	JenisPegawai *string `gorm:"column:jenis_pegawai"`
	UnitKerja    string  `gorm:"column:unit_kerja"`
	Prodi        *string `gorm:"column:prodi"`
}

func (s *statistikService) SyncFromBkd(bkdDb *gorm.DB) ([]entity.Statistik, time.Time, error) {
	var pegs []BKDPegawai
	err := bkdDb.Table("executive.pegawais").
		Where("status_pegawai = 'ACTIVE'").
		Find(&pegs).Error
	if err != nil {
		return nil, time.Time{}, err
	}

	type StatAccum struct {
		Pns         int
		TetapNonPns int
		Nidk        int
		Total       int
	}

	dosenStats := make(map[string]*StatAccum)
	tendikStats := make(map[string]*StatAccum)

	// Robust mapping of employee unit_kerja or prodi to standard faculties/units
	getFacultyAndShort := func(unit, prodi string) (string, string) {
		s := strings.ToLower(unit + " " + prodi)

		if strings.Contains(s, "kedokteran gigi") || strings.Contains(s, "dentistry") {
			return "Fakultas Kedokteran Gigi", "FKG"
		}
		if strings.Contains(s, "kedokteran") || strings.Contains(s, "medicine") {
			return "Fakultas Kedokteran", "FK"
		}
		if strings.Contains(s, "matematika") || strings.Contains(s, "fisika") || strings.Contains(s, "kimia") || strings.Contains(s, "biologi") || strings.Contains(s, "fmipa") || strings.Contains(s, "science") {
			return "Fakultas Matematika dan Ilmu Pengetahuan Alam", "FMIPA"
		}
		if strings.Contains(s, "teknik") || strings.Contains(s, "engineering") {
			return "Fakultas Teknik", "FT"
		}
		if strings.Contains(s, "hukum") || strings.Contains(s, "law") {
			return "Fakultas Hukum", "FH"
		}
		if strings.Contains(s, "ekonomi") || strings.Contains(s, "bisnis") || strings.Contains(s, "economics") || strings.Contains(s, "business") {
			return "Fakultas Ekonomi dan Bisnis", "FEB"
		}
		if strings.Contains(s, "sastra") || strings.Contains(s, "budaya") || strings.Contains(s, "humanities") || strings.Contains(s, "cultural") {
			return "Fakultas Ilmu Pengetahuan Budaya", "FIB"
		}
		if strings.Contains(s, "psikologi") || strings.Contains(s, "psychology") {
			return "Fakultas Psikologi", "FPsi"
		}
		if strings.Contains(s, "sosial") || strings.Contains(s, "politik") || strings.Contains(s, "social") || strings.Contains(s, "political") {
			return "Fakultas Ilmu Sosial dan Politik", "FISIP"
		}
		if strings.Contains(s, "kesehatan masyarakat") || strings.Contains(s, "public health") {
			return "Fakultas Kesehatan Masyarakat", "FKM"
		}
		if strings.Contains(s, "komputer") || strings.Contains(s, "computer") || strings.Contains(s, "fasilkom") {
			return "Fakultas Ilmu Komputer", "FASILKOM"
		}
		if strings.Contains(s, "keperawatan") || strings.Contains(s, "nursing") {
			return "Fakultas Ilmu Keperawatan", "FIK"
		}
		if strings.Contains(s, "vokasi") || strings.Contains(s, "vocational") || strings.Contains(s, "voks") {
			return "Program Pendidikan Vokasi", "VOKASI"
		}
		if strings.Contains(s, "farmasi") || strings.Contains(s, "pharmacy") {
			return "Fakultas Farmasi", "FF"
		}
		if strings.Contains(s, "administrasi") || strings.Contains(s, "administration") {
			return "Fakultas Ilmu Administrasi", "FIA"
		}
		if strings.Contains(s, "pascasarjana") || strings.Contains(s, "sppb") || strings.Contains(s, "sksg") || strings.Contains(s, "lingkungan") || strings.Contains(s, "environmental") {
			return "Sekolah Pascasarjana Pembangunan Berkelanjutan", "SPPB"
		}
		if strings.Contains(s, "rik") || strings.Contains(s, "rumpun ilmu kesehatan") {
			return "RIK", "RIK"
		}

		return "PAU", "PAU"
	}

	for _, p := range pegs {
		prodiStr := ""
		if p.Prodi != nil {
			prodiStr = *p.Prodi
		}
		facName, facShort := getFacultyAndShort(p.UnitKerja, prodiStr)

		cat := "TENDIK"
		if p.Kategori != nil {
			cat = strings.ToUpper(strings.TrimSpace(*p.Kategori))
		} else {
			// Fallback check
			unitL := strings.ToLower(p.UnitKerja)
			prodiL := strings.ToLower(prodiStr)
			if strings.Contains(unitL, "program studi") || strings.Contains(prodiL, "program studi") || strings.Contains(unitL, "prodi") || strings.Contains(unitL, "department") {
				cat = "DOSEN"
			}
		}

		jp := ""
		if p.JenisPegawai != nil {
			jp = strings.ToUpper(strings.TrimSpace(*p.JenisPegawai))
		}

		isPNS := jp == "PNS" || jp == "CALON PNS"
		isTetapNonPNS := jp == "NON PNS" || jp == "CALON NON PNS"
		isNIDK := jp == "PEGAWAI DENGAN PERJANJIAN KERJA" || jp == "PPPK"

		// For fallback, PTT is non-PNS for Tendik, NIDK or non-PNS for Dosen
		if jp == "PTT" {
			if cat == "TENDIK" {
				isTetapNonPNS = true
			} else {
				isNIDK = true
			}
		}

		if cat == "DOSEN" {
			if _, ok := dosenStats[facName]; !ok {
				dosenStats[facName] = &StatAccum{}
			}
			acc := dosenStats[facName]
			if isPNS {
				acc.Pns++
			} else if isTetapNonPNS {
				acc.TetapNonPns++
			} else if isNIDK {
				acc.Nidk++
			}
			acc.Total++
		} else {
			// Tendik
			key := facShort
			if _, ok := tendikStats[key]; !ok {
				tendikStats[key] = &StatAccum{}
			}
			acc := tendikStats[key]
			if isPNS {
				acc.Pns++
			} else {
				acc.TetapNonPns++ // Non-PNS
			}
			acc.Total++
		}
	}

	now := time.Now()
	var toSave []entity.Statistik

	tendikNames := map[string]string{
		"FK":       "FK",
		"FKG":      "FKG",
		"FMIPA":    "FMIPA",
		"FT":       "FT",
		"FH":       "FH",
		"FEB":      "FEB",
		"FIB":      "FIB",
		"FPsi":     "FPsi",
		"FISIP":    "FISIP",
		"FKM":      "FKM",
		"FASILKOM": "FASILKOM",
		"FIK":      "FIK",
		"PAU":      "PAU",
		"VOKASI":   "VOKASI",
		"FF":       "FF",
		"FIA":      "FIA",
		"SPPB":     "SPPB",
		"RIK":      "RIK",
	}

	// Gather Dosen
	for fac, acc := range dosenStats {
		_, short := getFacultyAndShort(fac, "")
		toSave = append(toSave, entity.Statistik{
			Kategori:    "dosen",
			UnitName:    fac,
			UnitShort:   short,
			Pns:         acc.Pns,
			TetapNonPns: acc.TetapNonPns,
			Nidk:        acc.Nidk,
			Total:       acc.Total,
			UpdatedAt:   now,
		})
	}

	// Gather Tendik
	for unit, acc := range tendikStats {
		name := tendikNames[unit]
		if name == "" {
			name = unit
		}
		toSave = append(toSave, entity.Statistik{
			Kategori:    "tendik",
			UnitName:    name,
			UnitShort:   unit,
			Pns:         acc.Pns,
			TetapNonPns: acc.TetapNonPns,
			Nidk:        0,
			Total:       acc.Total,
			UpdatedAt:   now,
		})
	}

	if err := s.repo.ReplaceAll(toSave); err != nil {
		return nil, time.Time{}, err
	}

	return toSave, now, nil
}
