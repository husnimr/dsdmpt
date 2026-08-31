package service

import (
	"errors"
	"strings"
	"time"

	"dsdmpt-backend/internal/module/dsdmpt/entity"
	"dsdmpt-backend/internal/module/dsdmpt/repository"
	"dsdmpt-backend/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type NewsService interface {
	GetNews(status string, page, limit int) ([]entity.News, int, int, int, int, error)
	GetNewsDetail(idOrSlug string) (*entity.News, error)
	GetAllAdminNews() ([]entity.News, error)
	CreateNews(title, content, imageURL string, publishedAt time.Time, author, slug, status, images string, thumbnailIdx int) (int, error)
	UpdateNews(id int, title, content, imageURL string, publishedAt time.Time, author, slug, status, images string, thumbnailIdx int) error
	DeleteNews(id int) error
}

type SubdirectorateService interface {
	GetSubdirectorates() ([]entity.Subdirectorate, error)
}

type SettingService interface {
	GetSettings() (map[string]string, error)
	UpdateSettings(updates map[string]string) error
}

type UserService interface {
	GetAllUsers() ([]entity.User, error)
	CreateUser(username, password, name, email, role string) (int, error)
	UpdateUser(id int, username, password, name, email, role string) error
	DeleteUser(id int) error
	Login(username, password, jwtSecret string) (string, *entity.User, error)
}

type ProgramKerjaService interface {
	GetProgramKerja() ([]entity.ProgramKerja, error)
	CreateProgramKerja(title, description, iconName string) (int, error)
	UpdateProgramKerja(id int, title, description, iconName string) error
	DeleteProgramKerja(id int) error
}

type AksesPegawaiService interface {
	GetAksesPegawai() ([]entity.AksesPegawai, error)
	CreateAksesPegawai(title, description, link string) (int, error)
	UpdateAksesPegawai(id int, title, description, link string, position int) error
	DeleteAksesPegawai(id int) error
	Reorder(ids []int) error
}

type RekrutmenService interface {
	GetRekrutmen() ([]entity.Rekrutmen, error)
	CreateRekrutmen(title, link string) (int, error)
	UpdateRekrutmen(id int, title, link string, position int) error
	DeleteRekrutmen(id int) error
	Reorder(ids []int) error
}

type PengembanganTalentaService interface {
	GetPengembanganTalenta() ([]entity.PengembanganTalenta, error)
	GetDetail(idOrSlug string) (*entity.PengembanganTalenta, error)
	CreatePengembanganTalenta(title, organizer, date, time, location, image, ptype, agenda, description, syllabusURL, regLink, phone string) error
	UpdatePengembanganTalenta(id int, title, organizer, date, time, location, image, ptype, agenda string, position int, description, syllabusURL, regLink, phone string) error
	DeletePengembanganTalenta(id int) error
	Reorder(ids []int) error
}

type InformasiService interface {
	GetInformasi() ([]entity.Informasi, error)
	CreateInformasi(title, description, imageURL, fileURL string) error
	UpdateInformasi(id int, title, description, imageURL, fileURL string, position int) error
	DeleteInformasi(id int) error
	Reorder(ids []int) error
}

type DokumenTerkiniService interface {
	GetDokumenTerkini() ([]entity.DokumenTerkini, error)
	CreateDokumenTerkini(title, fileURL, link string) error
	UpdateDokumenTerkini(id int, title, fileURL, link string, position int) error
	DeleteDokumenTerkini(id int) error
	Reorder(ids []int) error
}

// Implementations

type newsService struct {
	repo repository.NewsRepository
}

func NewNewsService(repo repository.NewsRepository) NewsService { return &newsService{repo: repo} }

func (s *newsService) GetNews(status string, page, limit int) ([]entity.News, int, int, int, int, error) {
	if page < 1 {
		page = 1
	}
	if limit > 0 {
		offset := (page - 1) * limit
		data, total, err := s.repo.GetPaginated(status, limit, offset)
		if err != nil {
			return nil, 0, 0, 0, 0, err
		}
		totalPages := int((total + int64(limit) - 1) / int64(limit))
		if totalPages < 1 {
			totalPages = 1
		}
		return data, int(total), page, limit, totalPages, nil
	} else {
		data, err := s.repo.GetAll(status)
		if err != nil {
			return nil, 0, 0, 0, 0, err
		}
		return data, len(data), page, 0, 1, nil
	}
}

func (s *newsService) GetNewsDetail(idOrSlug string) (*entity.News, error) {
	// Try finding by exact ID first
	var id int
	if _, err := idxConverter(idOrSlug, &id); err == nil && id > 0 {
		if n, err := s.repo.GetByID(id); err == nil {
			return n, nil
		}
	}

	// Try extracting ID from trailing slug suffix (e.g. slug-123)
	if idx := strings.LastIndex(idOrSlug, "-"); idx != -1 {
		suffix := idOrSlug[idx+1:]
		var suffixID int
		if _, err := idxConverter(suffix, &suffixID); err == nil && suffixID > 0 {
			if n, err := s.repo.GetByID(suffixID); err == nil {
				return n, nil
			}
		}
	}

	// Fallback to finding by exact slug
	return s.repo.GetBySlug(idOrSlug)
}

func (s *newsService) GetAllAdminNews() ([]entity.News, error) {
	return s.repo.GetAll("")
}

func (s *newsService) CreateNews(title, content, imageURL string, publishedAt time.Time, author, slug, status, images string, thumbnailIdx int) (int, error) {
	if publishedAt.IsZero() {
		publishedAt = time.Now()
	}
	if status == "" {
		status = "published"
	}
	if images == "" {
		images = "[]"
	}
	n := &entity.News{
		Title:        title,
		Content:      content,
		ImageURL:     imageURL,
		PublishedAt:  publishedAt,
		Author:       author,
		Slug:         slug,
		Status:       status,
		Images:       images,
		ThumbnailIdx: thumbnailIdx,
	}
	err := s.repo.Create(n)
	return n.ID, err
}

func (s *newsService) UpdateNews(id int, title, content, imageURL string, publishedAt time.Time, author, slug, status, images string, thumbnailIdx int) error {
	n, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	n.Title = title
	n.Content = content
	n.ImageURL = imageURL
	if !publishedAt.IsZero() {
		n.PublishedAt = publishedAt
	}
	n.Author = author
	n.Slug = slug
	n.Status = status
	n.Images = images
	n.ThumbnailIdx = thumbnailIdx
	return s.repo.Update(n)
}

func (s *newsService) DeleteNews(id int) error {
	return s.repo.Delete(id)
}

type subdirectorateService struct {
	repo repository.SubdirectorateRepository
}

func NewSubdirectorateService(repo repository.SubdirectorateRepository) SubdirectorateService {
	return &subdirectorateService{repo: repo}
}

func (s *subdirectorateService) GetSubdirectorates() ([]entity.Subdirectorate, error) {
	return s.repo.GetAll()
}

type settingService struct {
	repo repository.SettingRepository
}

func NewSettingService(repo repository.SettingRepository) SettingService {
	return &settingService{repo: repo}
}

func (s *settingService) GetSettings() (map[string]string, error) {
	list, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	m := make(map[string]string)
	for _, item := range list {
		m[item.Key] = item.Value
	}
	return m, nil
}

func (s *settingService) UpdateSettings(updates map[string]string) error {
	for k, v := range updates {
		if err := s.repo.Save(k, v); err != nil {
			return err
		}
	}
	return nil
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService { return &userService{repo: repo} }

func (s *userService) GetAllUsers() ([]entity.User, error) {
	return s.repo.GetAll()
}

func (s *userService) CreateUser(username, password, name, email, role string) (int, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}
	u := &entity.User{
		Username:  username,
		Password:  string(hashedPassword),
		Name:      name,
		Email:     email,
		Role:      role,
		CreatedAt: time.Now(),
	}
	err = s.repo.Create(u)
	return u.ID, err
}

func (s *userService) UpdateUser(id int, username, password, name, email, role string) error {
	u, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	u.Username = username
	u.Name = name
	u.Email = email
	u.Role = role

	if password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		u.Password = string(hashed)
	}

	return s.repo.Update(u)
}

func (s *userService) DeleteUser(id int) error {
	if id == 1 {
		return errors.New("Superadmin utama tidak dapat dihapus")
	}
	return s.repo.Delete(id)
}

func (s *userService) Login(username, password, jwtSecret string) (string, *entity.User, error) {
	u, err := s.repo.GetByUsername(username)
	if err != nil {
		return "", nil, errors.New("Invalid username or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)); err != nil {
		return "", nil, errors.New("Invalid username or password")
	}

	token, err := utils.GenerateJWT(u.ID, u.Username, u.Role, jwtSecret)
	if err != nil {
		return "", nil, err
	}

	return token, u, nil
}

type programKerjaService struct {
	repo repository.ProgramKerjaRepository
}

func NewProgramKerjaService(repo repository.ProgramKerjaRepository) ProgramKerjaService {
	return &programKerjaService{repo: repo}
}

func (s *programKerjaService) GetProgramKerja() ([]entity.ProgramKerja, error) {
	return s.repo.GetAll()
}

func (s *programKerjaService) CreateProgramKerja(title, description, iconName string) (int, error) {
	pk := &entity.ProgramKerja{
		Title:       title,
		Description: description,
		IconName:    iconName,
	}
	err := s.repo.Create(pk)
	return pk.ID, err
}

func (s *programKerjaService) UpdateProgramKerja(id int, title, description, iconName string) error {
	pk, err := s.repo.GetAll() // Just load and find or use direct get
	if err != nil {
		return err
	}
	var target *entity.ProgramKerja
	for idx := range pk {
		if pk[idx].ID == id {
			target = &pk[idx]
			break
		}
	}
	if target == nil {
		return errors.New("not found")
	}
	target.Title = title
	target.Description = description
	target.IconName = iconName
	return s.repo.Update(target)
}

func (s *programKerjaService) DeleteProgramKerja(id int) error {
	return s.repo.Delete(id)
}

type aksesPegawaiService struct {
	repo repository.AksesPegawaiRepository
}

func NewAksesPegawaiService(repo repository.AksesPegawaiRepository) AksesPegawaiService {
	return &aksesPegawaiService{repo: repo}
}

func (s *aksesPegawaiService) GetAksesPegawai() ([]entity.AksesPegawai, error) {
	return s.repo.GetAll()
}

func (s *aksesPegawaiService) CreateAksesPegawai(title, description, link string) (int, error) {
	maxPos, _ := s.repo.GetMaxPosition()
	ap := &entity.AksesPegawai{
		Title:       title,
		Description: description,
		Link:        link,
		Position:    maxPos + 1,
	}
	err := s.repo.Create(ap)
	return ap.ID, err
}

func (s *aksesPegawaiService) UpdateAksesPegawai(id int, title, description, link string, position int) error {
	// A simple load is fine
	list, err := s.repo.GetAll()
	if err != nil {
		return err
	}
	var target *entity.AksesPegawai
	for idx := range list {
		if list[idx].ID == id {
			target = &list[idx]
			break
		}
	}
	if target == nil {
		return errors.New("not found")
	}
	target.Title = title
	target.Description = description
	target.Link = link
	target.Position = position
	return s.repo.Update(target)
}

func (s *aksesPegawaiService) DeleteAksesPegawai(id int) error {
	return s.repo.Delete(id)
}

func (s *aksesPegawaiService) Reorder(ids []int) error {
	for idx, id := range ids {
		if err := s.repo.UpdatePosition(id, idx+1); err != nil {
			return err
		}
	}
	return nil
}

type rekrutmenService struct {
	repo repository.RekrutmenRepository
}

func NewRekrutmenService(repo repository.RekrutmenRepository) RekrutmenService {
	return &rekrutmenService{repo: repo}
}

func (s *rekrutmenService) GetRekrutmen() ([]entity.Rekrutmen, error) {
	return s.repo.GetAll()
}

func (s *rekrutmenService) CreateRekrutmen(title, link string) (int, error) {
	maxPos, _ := s.repo.GetMaxPosition()
	rec := &entity.Rekrutmen{
		Title:    title,
		Link:     link,
		Position: maxPos + 1,
	}
	err := s.repo.Create(rec)
	return rec.ID, err
}

func (s *rekrutmenService) UpdateRekrutmen(id int, title, link string, position int) error {
	list, err := s.repo.GetAll()
	if err != nil {
		return err
	}
	var target *entity.Rekrutmen
	for idx := range list {
		if list[idx].ID == id {
			target = &list[idx]
			break
		}
	}
	if target == nil {
		return errors.New("not found")
	}
	target.Title = title
	target.Link = link
	target.Position = position
	return s.repo.Update(target)
}

func (s *rekrutmenService) DeleteRekrutmen(id int) error {
	return s.repo.Delete(id)
}

func (s *rekrutmenService) Reorder(ids []int) error {
	for idx, id := range ids {
		if err := s.repo.UpdatePosition(id, idx+1); err != nil {
			return err
		}
	}
	return nil
}

type pengembanganTalentaService struct {
	repo repository.PengembanganTalentaRepository
}

func NewPengembanganTalentaService(repo repository.PengembanganTalentaRepository) PengembanganTalentaService {
	return &pengembanganTalentaService{repo: repo}
}

func (s *pengembanganTalentaService) GetPengembanganTalenta() ([]entity.PengembanganTalenta, error) {
	return s.repo.GetAll()
}

func (s *pengembanganTalentaService) GetDetail(idOrSlug string) (*entity.PengembanganTalenta, error) {
	var id int
	var isID bool
	_, err := idxConverter(idOrSlug, &id)
	if err == nil && id > 0 {
		isID = true
	}

	if isID {
		return s.repo.GetByID(id)
	}

	// Slug matching
	list, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}

	slugifyGo := func(t string) string {
		t = strings.ToLower(t)
		var sb strings.Builder
		for _, r := range t {
			if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == ' ' || r == '-' {
				sb.WriteRune(r)
			}
		}
		res := sb.String()
		res = strings.ReplaceAll(res, " ", "-")
		for strings.Contains(res, "--") {
			res = strings.ReplaceAll(res, "--", "-")
		}
		return strings.Trim(res, "-")
	}

	for _, temp := range list {
		if slugifyGo(temp.Title) == idOrSlug {
			return &temp, nil
		}
	}

	return nil, errors.New("Program not found")
}

func (s *pengembanganTalentaService) CreatePengembanganTalenta(title, organizer, date, time, location, image, ptype, agenda, description, syllabusURL, regLink, phone string) error {
	// Shift positions
	if err := s.repo.IncrementAllPositions(); err != nil {
		return err
	}
	if agenda == "" {
		agenda = "[]"
	}
	pt := &entity.PengembanganTalenta{
		Title:            title,
		Organizer:        organizer,
		Date:             date,
		Time:             time,
		Location:         location,
		Image:            image,
		Type:             ptype,
		Agenda:           agenda,
		Position:         1,
		Description:      description,
		SyllabusURL:      syllabusURL,
		RegistrationLink: regLink,
		ContactPhone:     phone,
	}
	return s.repo.Create(pt)
}

func (s *pengembanganTalentaService) UpdatePengembanganTalenta(id int, title, organizer, date, time, location, image, ptype, agenda string, position int, description, syllabusURL, regLink, phone string) error {
	pt, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	pt.Title = title
	pt.Organizer = organizer
	pt.Date = date
	pt.Time = time
	pt.Location = location
	pt.Image = image
	pt.Type = ptype
	if agenda != "" {
		pt.Agenda = agenda
	}
	pt.Position = position
	pt.Description = description
	pt.SyllabusURL = syllabusURL
	pt.RegistrationLink = regLink
	pt.ContactPhone = phone
	return s.repo.Update(pt)
}

func (s *pengembanganTalentaService) DeletePengembanganTalenta(id int) error {
	return s.repo.Delete(id)
}

func (s *pengembanganTalentaService) Reorder(ids []int) error {
	for idx, id := range ids {
		if err := s.repo.UpdatePosition(id, idx+1); err != nil {
			return err
		}
	}
	return nil
}

type informasiService struct {
	repo repository.InformasiRepository
}

func NewInformasiService(repo repository.InformasiRepository) InformasiService {
	return &informasiService{repo: repo}
}

func (s *informasiService) GetInformasi() ([]entity.Informasi, error) {
	return s.repo.GetAll()
}

func (s *informasiService) CreateInformasi(title, description, imageURL, fileURL string) error {
	if err := s.repo.IncrementAllPositions(); err != nil {
		return err
	}
	info := &entity.Informasi{
		Title:       title,
		Description: description,
		ImageURL:    imageURL,
		FileURL:     fileURL,
		Position:    1,
	}
	return s.repo.Create(info)
}

func (s *informasiService) UpdateInformasi(id int, title, description, imageURL, fileURL string, position int) error {
	list, err := s.repo.GetAll()
	if err != nil {
		return err
	}
	var target *entity.Informasi
	for idx := range list {
		if list[idx].ID == id {
			target = &list[idx]
			break
		}
	}
	if target == nil {
		return errors.New("not found")
	}
	target.Title = title
	target.Description = description
	target.ImageURL = imageURL
	target.FileURL = fileURL
	target.Position = position
	return s.repo.Update(target)
}

func (s *informasiService) DeleteInformasi(id int) error {
	return s.repo.Delete(id)
}

func (s *informasiService) Reorder(ids []int) error {
	for idx, id := range ids {
		if err := s.repo.UpdatePosition(id, idx+1); err != nil {
			return err
		}
	}
	return nil
}

type dokumenTerkiniService struct {
	repo repository.DokumenTerkiniRepository
}

func NewDokumenTerkiniService(repo repository.DokumenTerkiniRepository) DokumenTerkiniService {
	return &dokumenTerkiniService{repo: repo}
}

func (s *dokumenTerkiniService) GetDokumenTerkini() ([]entity.DokumenTerkini, error) {
	return s.repo.GetAll()
}

func (s *dokumenTerkiniService) CreateDokumenTerkini(title, fileURL, link string) error {
	if err := s.repo.IncrementAllPositions(); err != nil {
		return err
	}
	doc := &entity.DokumenTerkini{
		Title:    title,
		FileURL:  fileURL,
		Link:     link,
		Position: 1,
	}
	return s.repo.Create(doc)
}

func (s *dokumenTerkiniService) UpdateDokumenTerkini(id int, title, fileURL, link string, position int) error {
	list, err := s.repo.GetAll()
	if err != nil {
		return err
	}
	var target *entity.DokumenTerkini
	for idx := range list {
		if list[idx].ID == id {
			target = &list[idx]
			break
		}
	}
	if target == nil {
		return errors.New("not found")
	}
	target.Title = title
	target.FileURL = fileURL
	target.Link = link
	target.Position = position
	return s.repo.Update(target)
}

func (s *dokumenTerkiniService) DeleteDokumenTerkini(id int) error {
	return s.repo.Delete(id)
}

func (s *dokumenTerkiniService) Reorder(ids []int) error {
	for idx, id := range ids {
		if err := s.repo.UpdatePosition(id, idx+1); err != nil {
			return err
		}
	}
	return nil
}

// Helpers
func idxConverter(s string, out *int) (int, error) {
	var val int
	var err error
	for i := 0; i < len(s); i++ {
		if s[i] < '0' || s[i] > '9' {
			return 0, errors.New("not int")
		}
		val = val*10 + int(s[i]-'0')
	}
	*out = val
	return val, err
}
