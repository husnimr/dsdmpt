package repository

import (
	"dsdmpt-backend/internal/module/dsdmpt/entity"
	"gorm.io/gorm"
)

type NewsRepository interface {
	GetAll(status string) ([]entity.News, error)
	GetPaginated(status string, limit, offset int) ([]entity.News, int64, error)
	GetByID(id int) (*entity.News, error)
	GetBySlug(slug string) (*entity.News, error)
	Create(news *entity.News) error
	Update(news *entity.News) error
	Delete(id int) error
}

type SubdirectorateRepository interface {
	GetAll() ([]entity.Subdirectorate, error)
}

type SettingRepository interface {
	GetAll() ([]entity.Setting, error)
	Save(key, value string) error
}

type UserRepository interface {
	GetAll() ([]entity.User, error)
	GetByID(id int) (*entity.User, error)
	GetByUsername(username string) (*entity.User, error)
	Create(user *entity.User) error
	Update(user *entity.User) error
	Delete(id int) error
}

type ProgramKerjaRepository interface {
	GetAll() ([]entity.ProgramKerja, error)
	Create(pk *entity.ProgramKerja) error
	Update(pk *entity.ProgramKerja) error
	Delete(id int) error
}

type AksesPegawaiRepository interface {
	GetAll() ([]entity.AksesPegawai, error)
	Create(ap *entity.AksesPegawai) error
	Update(ap *entity.AksesPegawai) error
	Delete(id int) error
	GetMaxPosition() (int, error)
	UpdatePosition(id int, position int) error
}

type RekrutmenRepository interface {
	GetAll() ([]entity.Rekrutmen, error)
	Create(rec *entity.Rekrutmen) error
	Update(rec *entity.Rekrutmen) error
	Delete(id int) error
	GetMaxPosition() (int, error)
	UpdatePosition(id int, position int) error
}

type PengembanganTalentaRepository interface {
	GetAll() ([]entity.PengembanganTalenta, error)
	GetByID(id int) (*entity.PengembanganTalenta, error)
	Create(pt *entity.PengembanganTalenta) error
	Update(pt *entity.PengembanganTalenta) error
	Delete(id int) error
	IncrementAllPositions() error
	UpdatePosition(id int, position int) error
}

type InformasiRepository interface {
	GetAll() ([]entity.Informasi, error)
	Create(info *entity.Informasi) error
	Update(info *entity.Informasi) error
	Delete(id int) error
	IncrementAllPositions() error
	UpdatePosition(id int, position int) error
}

type DokumenTerkiniRepository interface {
	GetAll() ([]entity.DokumenTerkini, error)
	Create(doc *entity.DokumenTerkini) error
	Update(doc *entity.DokumenTerkini) error
	Delete(id int) error
	IncrementAllPositions() error
	UpdatePosition(id int, position int) error
}

// Implementations

type newsRepository struct {
	db *gorm.DB
}

func NewNewsRepository(db *gorm.DB) NewsRepository { return &newsRepository{db: db} }

func (r *newsRepository) GetAll(status string) ([]entity.News, error) {
	var list []entity.News
	q := r.db.Order("published_at DESC, id DESC")
	if status != "" {
		q = q.Where("status = ?", status)
	}
	err := q.Find(&list).Error
	return list, err
}

func (r *newsRepository) GetPaginated(status string, limit, offset int) ([]entity.News, int64, error) {
	var list []entity.News
	var total int64
	q := r.db.Model(&entity.News{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("published_at DESC, id DESC").Limit(limit).Offset(offset).Find(&list).Error
	return list, total, err
}

func (r *newsRepository) GetByID(id int) (*entity.News, error) {
	var n entity.News
	err := r.db.First(&n, id).Error
	return &n, err
}

func (r *newsRepository) GetBySlug(slug string) (*entity.News, error) {
	var n entity.News
	err := r.db.Where("slug = ?", slug).First(&n).Error
	return &n, err
}

func (r *newsRepository) Create(news *entity.News) error {
	return r.db.Create(news).Error
}

func (r *newsRepository) Update(news *entity.News) error {
	return r.db.Save(news).Error
}

func (r *newsRepository) Delete(id int) error {
	return r.db.Delete(&entity.News{}, id).Error
}

type subdirectorateRepository struct {
	db *gorm.DB
}

func NewSubdirectorateRepository(db *gorm.DB) SubdirectorateRepository {
	return &subdirectorateRepository{db: db}
}

func (r *subdirectorateRepository) GetAll() ([]entity.Subdirectorate, error) {
	var list []entity.Subdirectorate
	err := r.db.Order("id ASC").Find(&list).Error
	return list, err
}

type settingRepository struct {
	db *gorm.DB
}

func NewSettingRepository(db *gorm.DB) SettingRepository { return &settingRepository{db: db} }

func (r *settingRepository) GetAll() ([]entity.Setting, error) {
	var list []entity.Setting
	err := r.db.Find(&list).Error
	return list, err
}

func (r *settingRepository) Save(key, value string) error {
	setting := entity.Setting{Key: key, Value: value}
	return r.db.Save(&setting).Error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository { return &userRepository{db: db} }

func (r *userRepository) GetAll() ([]entity.User, error) {
	var list []entity.User
	err := r.db.Order("id ASC").Find(&list).Error
	return list, err
}

func (r *userRepository) GetByID(id int) (*entity.User, error) {
	var u entity.User
	err := r.db.First(&u, id).Error
	return &u, err
}

func (r *userRepository) GetByUsername(username string) (*entity.User, error) {
	var u entity.User
	err := r.db.Where("username = ?", username).First(&u).Error
	return &u, err
}

func (r *userRepository) Create(user *entity.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) Update(user *entity.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id int) error {
	return r.db.Delete(&entity.User{}, id).Error
}

type programKerjaRepository struct {
	db *gorm.DB
}

func NewProgramKerjaRepository(db *gorm.DB) ProgramKerjaRepository {
	return &programKerjaRepository{db: db}
}

func (r *programKerjaRepository) GetAll() ([]entity.ProgramKerja, error) {
	var list []entity.ProgramKerja
	err := r.db.Order("id ASC").Find(&list).Error
	return list, err
}

func (r *programKerjaRepository) Create(pk *entity.ProgramKerja) error {
	return r.db.Create(pk).Error
}

func (r *programKerjaRepository) Update(pk *entity.ProgramKerja) error {
	return r.db.Save(pk).Error
}

func (r *programKerjaRepository) Delete(id int) error {
	return r.db.Delete(&entity.ProgramKerja{}, id).Error
}

type aksesPegawaiRepository struct {
	db *gorm.DB
}

func NewAksesPegawaiRepository(db *gorm.DB) AksesPegawaiRepository {
	return &aksesPegawaiRepository{db: db}
}

func (r *aksesPegawaiRepository) GetAll() ([]entity.AksesPegawai, error) {
	var list []entity.AksesPegawai
	err := r.db.Order("position ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *aksesPegawaiRepository) Create(ap *entity.AksesPegawai) error {
	return r.db.Create(ap).Error
}

func (r *aksesPegawaiRepository) Update(ap *entity.AksesPegawai) error {
	return r.db.Save(ap).Error
}

func (r *aksesPegawaiRepository) Delete(id int) error {
	return r.db.Delete(&entity.AksesPegawai{}, id).Error
}

func (r *aksesPegawaiRepository) GetMaxPosition() (int, error) {
	var maxPos int
	err := r.db.Model(&entity.AksesPegawai{}).Select("COALESCE(MAX(position), 0)").Scan(&maxPos).Error
	return maxPos, err
}

func (r *aksesPegawaiRepository) UpdatePosition(id int, position int) error {
	return r.db.Model(&entity.AksesPegawai{}).Where("id = ?", id).Update("position", position).Error
}

type rekrutmenRepository struct {
	db *gorm.DB
}

func NewRekrutmenRepository(db *gorm.DB) RekrutmenRepository { return &rekrutmenRepository{db: db} }

func (r *rekrutmenRepository) GetAll() ([]entity.Rekrutmen, error) {
	var list []entity.Rekrutmen
	err := r.db.Order("position ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *rekrutmenRepository) Create(rec *entity.Rekrutmen) error {
	return r.db.Create(rec).Error
}

func (r *rekrutmenRepository) Update(rec *entity.Rekrutmen) error {
	return r.db.Save(rec).Error
}

func (r *rekrutmenRepository) Delete(id int) error {
	return r.db.Delete(&entity.Rekrutmen{}, id).Error
}

func (r *rekrutmenRepository) GetMaxPosition() (int, error) {
	var maxPos int
	err := r.db.Model(&entity.Rekrutmen{}).Select("COALESCE(MAX(position), 0)").Scan(&maxPos).Error
	return maxPos, err
}

func (r *rekrutmenRepository) UpdatePosition(id int, position int) error {
	return r.db.Model(&entity.Rekrutmen{}).Where("id = ?", id).Update("position", position).Error
}

type pengembanganTalentaRepository struct {
	db *gorm.DB
}

func NewPengembanganTalentaRepository(db *gorm.DB) PengembanganTalentaRepository {
	return &pengembanganTalentaRepository{db: db}
}

func (r *pengembanganTalentaRepository) GetAll() ([]entity.PengembanganTalenta, error) {
	var list []entity.PengembanganTalenta
	err := r.db.Order("position ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *pengembanganTalentaRepository) GetByID(id int) (*entity.PengembanganTalenta, error) {
	var pt entity.PengembanganTalenta
	err := r.db.First(&pt, id).Error
	return &pt, err
}

func (r *pengembanganTalentaRepository) Create(pt *entity.PengembanganTalenta) error {
	return r.db.Create(pt).Error
}

func (r *pengembanganTalentaRepository) Update(pt *entity.PengembanganTalenta) error {
	return r.db.Save(pt).Error
}

func (r *pengembanganTalentaRepository) Delete(id int) error {
	return r.db.Delete(&entity.PengembanganTalenta{}, id).Error
}

func (r *pengembanganTalentaRepository) IncrementAllPositions() error {
	return r.db.Model(&entity.PengembanganTalenta{}).Update("position", gorm.Expr("position + 1")).Error
}

func (r *pengembanganTalentaRepository) UpdatePosition(id int, position int) error {
	return r.db.Model(&entity.PengembanganTalenta{}).Where("id = ?", id).Update("position", position).Error
}

type informasiRepository struct {
	db *gorm.DB
}

func NewInformasiRepository(db *gorm.DB) InformasiRepository { return &informasiRepository{db: db} }

func (r *informasiRepository) GetAll() ([]entity.Informasi, error) {
	var list []entity.Informasi
	err := r.db.Order("position ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *informasiRepository) Create(info *entity.Informasi) error {
	return r.db.Create(info).Error
}

func (r *informasiRepository) Update(info *entity.Informasi) error {
	return r.db.Save(info).Error
}

func (r *informasiRepository) Delete(id int) error {
	return r.db.Delete(&entity.Informasi{}, id).Error
}

func (r *informasiRepository) IncrementAllPositions() error {
	return r.db.Model(&entity.Informasi{}).Update("position", gorm.Expr("position + 1")).Error
}

func (r *informasiRepository) UpdatePosition(id int, position int) error {
	return r.db.Model(&entity.Informasi{}).Where("id = ?", id).Update("position", position).Error
}

type dokumenTerkiniRepository struct {
	db *gorm.DB
}

func NewDokumenTerkiniRepository(db *gorm.DB) DokumenTerkiniRepository {
	return &dokumenTerkiniRepository{db: db}
}

func (r *dokumenTerkiniRepository) GetAll() ([]entity.DokumenTerkini, error) {
	var list []entity.DokumenTerkini
	err := r.db.Order("position ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *dokumenTerkiniRepository) Create(doc *entity.DokumenTerkini) error {
	return r.db.Create(doc).Error
}

func (r *dokumenTerkiniRepository) Update(doc *entity.DokumenTerkini) error {
	return r.db.Save(doc).Error
}

func (r *dokumenTerkiniRepository) Delete(id int) error {
	return r.db.Delete(&entity.DokumenTerkini{}, id).Error
}

func (r *dokumenTerkiniRepository) IncrementAllPositions() error {
	return r.db.Model(&entity.DokumenTerkini{}).Update("position", gorm.Expr("position + 1")).Error
}

func (r *dokumenTerkiniRepository) UpdatePosition(id int, position int) error {
	return r.db.Model(&entity.DokumenTerkini{}).Where("id = ?", id).Update("position", position).Error
}
