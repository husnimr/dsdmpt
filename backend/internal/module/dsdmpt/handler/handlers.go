package handler

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"dsdmpt-backend/internal/module/dsdmpt/entity"
	"dsdmpt-backend/internal/module/dsdmpt/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	svc service.UserService
	jwtSecret string
}

func NewAuthHandler(svc service.UserService, jwtSecret string) *AuthHandler {
	return &AuthHandler{svc: svc, jwtSecret: jwtSecret}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Username and password are required"})
		return
	}

	token, u, err := h.svc.Login(req.Username, req.Password, h.jwtSecret)
	if err != nil {
		c.JSON(401, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
		"user": gin.H{
			"id":         u.ID,
			"username":   u.Username,
			"name":       u.Name,
			"email":      u.Email,
			"role":       u.Role,
			"created_at": u.CreatedAt,
		},
	})
}

type NewsHandler struct {
	svc service.NewsService
}

func NewNewsHandler(svc service.NewsService) *NewsHandler {
	return &NewsHandler{svc: svc}
}

func (h *NewsHandler) GetNews(c *gin.Context) {
	pageStr := c.Query("page")
	limitStr := c.Query("limit")

	page := 1
	limit := 0
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	data, total, pg, lim, totalPages, err := h.svc.GetNews("published", page, limit)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"data":        data,
		"total":       total,
		"page":        pg,
		"limit":       lim,
		"total_pages": totalPages,
	})
}

func (h *NewsHandler) GetNewsDetail(c *gin.Context) {
	idOrSlug := c.Param("idOrSlug")
	n, err := h.svc.GetNewsDetail(idOrSlug)
	if err != nil {
		c.JSON(404, gin.H{"error": "Not found"})
		return
	}
	c.JSON(200, n)
}

func (h *NewsHandler) AdminNewsList(c *gin.Context) {
	list, err := h.svc.GetAllAdminNews()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *NewsHandler) AdminNewsCreate(c *gin.Context) {
	var n struct {
		Title        string    `json:"title" binding:"required"`
		Content      string    `json:"content" binding:"required"`
		ImageURL     string    `json:"image_url"`
		PublishedAt  time.Time `json:"published_at"`
		Author       string    `json:"author"`
		Slug         string    `json:"slug"`
		Status       string    `json:"status"`
		Images       string    `json:"images"`
		ThumbnailIdx int       `json:"thumbnail_idx"`
	}
	if err := c.ShouldBindJSON(&n); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	newID, err := h.svc.CreateNews(n.Title, n.Content, n.ImageURL, n.PublishedAt, n.Author, n.Slug, n.Status, n.Images, n.ThumbnailIdx)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(201, gin.H{"status": "created", "id": newID})
}

func (h *NewsHandler) AdminNewsUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var n struct {
		Title        string    `json:"title" binding:"required"`
		Content      string    `json:"content" binding:"required"`
		ImageURL     string    `json:"image_url"`
		PublishedAt  time.Time `json:"published_at"`
		Author       string    `json:"author"`
		Slug         string    `json:"slug"`
		Status       string    `json:"status"`
		Images       string    `json:"images"`
		ThumbnailIdx int       `json:"thumbnail_idx"`
	}
	if err := c.ShouldBindJSON(&n); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.svc.UpdateNews(id, n.Title, n.Content, n.ImageURL, n.PublishedAt, n.Author, n.Slug, n.Status, n.Images, n.ThumbnailIdx)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *NewsHandler) AdminNewsDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeleteNews(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

type SubdirectorateHandler struct {
	svc service.SubdirectorateService
}

func NewSubdirectorateHandler(svc service.SubdirectorateService) *SubdirectorateHandler {
	return &SubdirectorateHandler{svc: svc}
}

func (h *SubdirectorateHandler) GetSubdirectorates(c *gin.Context) {
	list, err := h.svc.GetSubdirectorates()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

type SettingHandler struct {
	svc service.SettingService
}

func NewSettingHandler(svc service.SettingService) *SettingHandler {
	return &SettingHandler{svc: svc}
}

func (h *SettingHandler) GetSettings(c *gin.Context) {
	settings, err := h.svc.GetSettings()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, settings)
}

func (h *SettingHandler) UpdateSettings(c *gin.Context) {
	var updates map[string]string
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}
	if err := h.svc.UpdateSettings(updates); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "ok"})
}

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(svc service.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) UsersList(c *gin.Context) {
	list, err := h.svc.GetAllUsers()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *UserHandler) UserCreate(c *gin.Context) {
	var u struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Role     string `json:"role"`
	}
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	newID, err := h.svc.CreateUser(u.Username, u.Password, u.Name, u.Email, u.Role)
	if err != nil {
		c.JSON(400, gin.H{"error": "Duplicate username atau email: " + err.Error()})
		return
	}
	c.JSON(201, gin.H{"status": "created", "id": newID})
}

func (h *UserHandler) UserUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var u struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password"`
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Role     string `json:"role"`
	}
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.svc.UpdateUser(id, u.Username, u.Password, u.Name, u.Email, u.Role)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *UserHandler) UserDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeleteUser(id); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

type ProgramKerjaHandler struct {
	svc service.ProgramKerjaService
}

func NewProgramKerjaHandler(svc service.ProgramKerjaService) *ProgramKerjaHandler {
	return &ProgramKerjaHandler{svc: svc}
}

func (h *ProgramKerjaHandler) List(c *gin.Context) {
	list, err := h.svc.GetProgramKerja()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *ProgramKerjaHandler) AdminList(c *gin.Context) {
	h.List(c)
}

func (h *ProgramKerjaHandler) AdminCreate(c *gin.Context) {
	var pk struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		IconName    string `json:"icon_name"`
	}
	if err := c.ShouldBindJSON(&pk); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	newID, err := h.svc.CreateProgramKerja(pk.Title, pk.Description, pk.IconName)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(201, gin.H{"status": "created", "id": newID})
}

func (h *ProgramKerjaHandler) AdminUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var pk struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		IconName    string `json:"icon_name"`
	}
	if err := c.ShouldBindJSON(&pk); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.svc.UpdateProgramKerja(id, pk.Title, pk.Description, pk.IconName)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *ProgramKerjaHandler) AdminDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeleteProgramKerja(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

type AksesPegawaiHandler struct {
	svc service.AksesPegawaiService
}

func NewAksesPegawaiHandler(svc service.AksesPegawaiService) *AksesPegawaiHandler {
	return &AksesPegawaiHandler{svc: svc}
}

func (h *AksesPegawaiHandler) List(c *gin.Context) {
	list, err := h.svc.GetAksesPegawai()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *AksesPegawaiHandler) AdminList(c *gin.Context) {
	h.List(c)
}

func (h *AksesPegawaiHandler) AdminCreate(c *gin.Context) {
	var ap struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		Link        string `json:"link" binding:"required"`
	}
	if err := c.ShouldBindJSON(&ap); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	newID, err := h.svc.CreateAksesPegawai(ap.Title, ap.Description, ap.Link)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(201, gin.H{"status": "created", "id": newID})
}

func (h *AksesPegawaiHandler) AdminUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var ap struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		Link        string `json:"link" binding:"required"`
		Position    int    `json:"position"`
	}
	if err := c.ShouldBindJSON(&ap); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.svc.UpdateAksesPegawai(id, ap.Title, ap.Description, ap.Link, ap.Position)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *AksesPegawaiHandler) AdminDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeleteAksesPegawai(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

func (h *AksesPegawaiHandler) AdminReorder(c *gin.Context) {
	var payload struct {
		IDs []int `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.Reorder(payload.IDs); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "reordered"})
}

type RekrutmenHandler struct {
	svc service.RekrutmenService
}

func NewRekrutmenHandler(svc service.RekrutmenService) *RekrutmenHandler {
	return &RekrutmenHandler{svc: svc}
}

func (h *RekrutmenHandler) List(c *gin.Context) {
	list, err := h.svc.GetRekrutmen()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *RekrutmenHandler) AdminList(c *gin.Context) {
	h.List(c)
}

func (h *RekrutmenHandler) AdminCreate(c *gin.Context) {
	var rec struct {
		Title string `json:"title" binding:"required"`
		Link  string `json:"link" binding:"required"`
	}
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	newID, err := h.svc.CreateRekrutmen(rec.Title, rec.Link)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(201, gin.H{"status": "created", "id": newID})
}

func (h *RekrutmenHandler) AdminUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var rec struct {
		Title    string `json:"title" binding:"required"`
		Link     string `json:"link" binding:"required"`
		Position int    `json:"position"`
	}
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.svc.UpdateRekrutmen(id, rec.Title, rec.Link, rec.Position)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *RekrutmenHandler) AdminDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeleteRekrutmen(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

func (h *RekrutmenHandler) AdminReorder(c *gin.Context) {
	var payload struct {
		IDs []int `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.Reorder(payload.IDs); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "reordered"})
}

type PengembanganTalentaHandler struct {
	svc service.PengembanganTalentaService
}

func NewPengembanganTalentaHandler(svc service.PengembanganTalentaService) *PengembanganTalentaHandler {
	return &PengembanganTalentaHandler{svc: svc}
}

func (h *PengembanganTalentaHandler) List(c *gin.Context) {
	list, err := h.svc.GetPengembanganTalenta()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *PengembanganTalentaHandler) Detail(c *gin.Context) {
	idOrSlug := c.Param("idOrSlug")
	pt, err := h.svc.GetDetail(idOrSlug)
	if err != nil {
		c.JSON(404, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, pt)
}

func (h *PengembanganTalentaHandler) AdminList(c *gin.Context) {
	h.List(c)
}

func (h *PengembanganTalentaHandler) AdminCreate(c *gin.Context) {
	var p struct {
		Title            string `json:"title" binding:"required"`
		Organizer        string `json:"organizer"`
		Date             string `json:"date"`
		Time             string `json:"time"`
		Location         string `json:"location"`
		Image            string `json:"image"`
		Type             string `json:"type"`
		Agenda           string `json:"agenda"`
		Description      string `json:"description"`
		SyllabusURL      string `json:"syllabus_url"`
		RegistrationLink string `json:"registration_link"`
		ContactPhone     string `json:"contact_phone"`
	}
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := h.svc.CreatePengembanganTalenta(p.Title, p.Organizer, p.Date, p.Time, p.Location, p.Image, p.Type, p.Agenda, p.Description, p.SyllabusURL, p.RegistrationLink, p.ContactPhone)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "created"})
}

func (h *PengembanganTalentaHandler) AdminUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var p struct {
		Title            string `json:"title" binding:"required"`
		Organizer        string `json:"organizer"`
		Date             string `json:"date"`
		Time             string `json:"time"`
		Location         string `json:"location"`
		Image            string `json:"image"`
		Type             string `json:"type"`
		Agenda           string `json:"agenda"`
		Position         int    `json:"position"`
		Description      string `json:"description"`
		SyllabusURL      string `json:"syllabus_url"`
		RegistrationLink string `json:"registration_link"`
		ContactPhone     string `json:"contact_phone"`
	}
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = h.svc.UpdatePengembanganTalenta(id, p.Title, p.Organizer, p.Date, p.Time, p.Location, p.Image, p.Type, p.Agenda, p.Position, p.Description, p.SyllabusURL, p.RegistrationLink, p.ContactPhone)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *PengembanganTalentaHandler) AdminDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeletePengembanganTalenta(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

func (h *PengembanganTalentaHandler) AdminReorder(c *gin.Context) {
	var payload struct {
		IDs []int `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.Reorder(payload.IDs); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "reordered"})
}

type InformasiHandler struct {
	svc service.InformasiService
}

func NewInformasiHandler(svc service.InformasiService) *InformasiHandler {
	return &InformasiHandler{svc: svc}
}

func (h *InformasiHandler) List(c *gin.Context) {
	list, err := h.svc.GetInformasi()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *InformasiHandler) AdminList(c *gin.Context) {
	h.List(c)
}

func (h *InformasiHandler) AdminCreate(c *gin.Context) {
	var i entity.Informasi
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if i.Title == "" {
		c.JSON(400, gin.H{"error": "Title tidak boleh kosong"})
		return
	}
	err := h.svc.CreateInformasi(i.Title, i.Description, i.ImageURL, i.FileURL)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "created"})
}

func (h *InformasiHandler) AdminUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var i entity.Informasi
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if i.Title == "" {
		c.JSON(400, gin.H{"error": "Title tidak boleh kosong"})
		return
	}

	err = h.svc.UpdateInformasi(id, i.Title, i.Description, i.ImageURL, i.FileURL, i.Position)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *InformasiHandler) AdminDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeleteInformasi(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

func (h *InformasiHandler) AdminReorder(c *gin.Context) {
	var payload struct {
		IDs []int `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.Reorder(payload.IDs); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "reordered"})
}

type DokumenTerkiniHandler struct {
	svc service.DokumenTerkiniService
}

func NewDokumenTerkiniHandler(svc service.DokumenTerkiniService) *DokumenTerkiniHandler {
	return &DokumenTerkiniHandler{svc: svc}
}

func (h *DokumenTerkiniHandler) List(c *gin.Context) {
	list, err := h.svc.GetDokumenTerkini()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *DokumenTerkiniHandler) AdminList(c *gin.Context) {
	h.List(c)
}

func (h *DokumenTerkiniHandler) AdminCreate(c *gin.Context) {
	var d entity.DokumenTerkini
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if d.Title == "" {
		c.JSON(400, gin.H{"error": "Title tidak boleh kosong"})
		return
	}
	err := h.svc.CreateDokumenTerkini(d.Title, d.FileURL, d.Link)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "created"})
}

func (h *DokumenTerkiniHandler) AdminUpdate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var d entity.DokumenTerkini
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if d.Title == "" {
		c.JSON(400, gin.H{"error": "Title tidak boleh kosong"})
		return
	}

	err = h.svc.UpdateDokumenTerkini(id, d.Title, d.FileURL, d.Link, d.Position)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "updated"})
}

func (h *DokumenTerkiniHandler) AdminDelete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	if err := h.svc.DeleteDokumenTerkini(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "deleted"})
}

func (h *DokumenTerkiniHandler) AdminReorder(c *gin.Context) {
	var payload struct {
		IDs []int `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.Reorder(payload.IDs); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "reordered"})
}

type UploadHandler struct{}

func NewUploadHandler() *UploadHandler { return &UploadHandler{} }

func (h *UploadHandler) Upload(c *gin.Context) {
	file, fileHandler, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"error": "Failed to read file: " + err.Error()})
		return
	}
	defer file.Close()

	ext := filepath.Ext(fileHandler.Filename)
	newFilename := fmt.Sprintf("upload_%d%s", time.Now().UnixNano(), ext)

	os.MkdirAll("./uploads", os.ModePerm)

	dst, err := os.Create(filepath.Join("./uploads", newFilename))
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create file: " + err.Error()})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(500, gin.H{"error": "Failed to save file: " + err.Error()})
		return
	}

	filePath := "/uploads/" + newFilename
	c.JSON(200, gin.H{"url": filePath})
}
