package entity

import "time"

type News struct {
	ID           int       `gorm:"primaryKey;autoIncrement" json:"id"`
	Title        string    `gorm:"type:varchar(255);not null" json:"title"`
	Content      string    `gorm:"type:text;not null" json:"content"`
	ImageURL     string    `gorm:"type:varchar(255);not null" json:"image_url"`
	PublishedAt  time.Time `gorm:"type:date;not null" json:"published_at"`
	Author       string    `gorm:"type:varchar(255)" json:"author"`
	Slug         string    `gorm:"type:varchar(255)" json:"slug"`
	Status       string    `gorm:"type:varchar(50);default:'published'" json:"status"`
	Images       string    `gorm:"type:text;default:'[]'" json:"images"`
	ThumbnailIdx int       `gorm:"type:integer;default:0" json:"thumbnail_idx"`
}

func (News) TableName() string {
	return "news"
}

type Subdirectorate struct {
	ID          int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string `gorm:"type:varchar(255);not null" json:"name"`
	Icon        string `gorm:"type:varchar(50);not null" json:"icon"`
	Description string `gorm:"type:text;not null" json:"description"`
}

func (Subdirectorate) TableName() string {
	return "subdirectorates"
}

type Setting struct {
	Key   string `gorm:"primaryKey;type:varchar(100)" json:"key"`
	Value string `gorm:"type:text;not null" json:"value"`
}

func (Setting) TableName() string {
	return "settings"
}

type User struct {
	ID        int       `gorm:"primaryKey;autoIncrement" json:"id"`
	Username  string    `gorm:"type:varchar(100);unique;not null" json:"username"`
	Password  string    `gorm:"type:varchar(255);not null" json:"-"`
	Name      string    `gorm:"type:varchar(255);not null" json:"name"`
	Email     string    `gorm:"type:varchar(255);unique;not null" json:"email"`
	Role      string    `gorm:"type:varchar(50);default:'admin'" json:"role"`
	CreatedAt time.Time `gorm:"type:timestamp;default:now()" json:"created_at"`
}

func (User) TableName() string {
	return "users"
}

type ProgramKerja struct {
	ID          int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string `gorm:"type:varchar(255);not null" json:"title"`
	Description string `gorm:"type:text;not null" json:"description"`
	IconName    string `gorm:"type:varchar(100);not null" json:"icon_name"`
}

func (ProgramKerja) TableName() string {
	return "program_kerja"
}

type AksesPegawai struct {
	ID          int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string `gorm:"type:varchar(255);not null" json:"title"`
	Description string `gorm:"type:text;not null" json:"description"`
	Link        string `gorm:"type:varchar(255);not null" json:"link"`
	Position    int    `gorm:"type:integer;default:0" json:"position"`
}

func (AksesPegawai) TableName() string {
	return "akses_pegawai"
}

type Rekrutmen struct {
	ID       int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Title    string `gorm:"type:varchar(255);not null" json:"title"`
	Link     string `gorm:"type:varchar(255);not null" json:"link"`
	Position int    `gorm:"type:integer;default:0" json:"position"`
}

func (Rekrutmen) TableName() string {
	return "rekrutmen"
}

type PengembanganTalenta struct {
	ID               int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Title            string `gorm:"type:varchar(255);not null" json:"title"`
	Organizer        string `gorm:"type:varchar(255);not null" json:"organizer"`
	Date             string `gorm:"type:varchar(255);not null" json:"date"`
	Time             string `gorm:"type:varchar(255);not null" json:"time"`
	Location         string `gorm:"type:varchar(255);not null" json:"location"`
	Image            string `gorm:"type:varchar(255);not null" json:"image"`
	Type             string `gorm:"type:varchar(50);not null" json:"type"`
	Agenda           string `gorm:"type:jsonb;default:'[]'::jsonb" json:"agenda"`
	Position         int    `gorm:"type:integer;default:0" json:"position"`
	Description      string `gorm:"type:text;default:''" json:"description"`
	SyllabusURL      string `gorm:"type:varchar(255);default:''" json:"syllabus_url"`
	RegistrationLink string `gorm:"type:varchar(255);default:''" json:"registration_link"`
	ContactPhone     string `gorm:"type:varchar(100);default:''" json:"contact_phone"`
}

func (PengembanganTalenta) TableName() string {
	return "pengembangan_talenta"
}

type Informasi struct {
	ID          int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string `gorm:"type:varchar(255);not null" json:"title"`
	Description string `gorm:"type:text;default:''" json:"description"`
	ImageURL    string `gorm:"type:varchar(255);default:''" json:"image_url"`
	FileURL     string `gorm:"type:varchar(255);default:''" json:"file_url"`
	Position    int    `gorm:"type:integer;default:0" json:"position"`
}

func (Informasi) TableName() string {
	return "informasi"
}

type DokumenTerkini struct {
	ID       int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Title    string `gorm:"type:varchar(255);not null" json:"title"`
	FileURL  string `gorm:"type:varchar(255);default:''" json:"file_url"`
	Link     string `gorm:"type:varchar(255);default:''" json:"link"`
	Position int    `gorm:"type:integer;default:0" json:"position"`
}

func (DokumenTerkini) TableName() string {
	return "dokumen_terkini"
}
