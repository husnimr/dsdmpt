package handler

import (
	"dsdmpt-backend/internal/module/dsdmpt/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StatistikHandler struct {
	svc   service.StatistikService
	bkdDb *gorm.DB
}

func NewStatistikHandler(svc service.StatistikService, bkdDb *gorm.DB) *StatistikHandler {
	return &StatistikHandler{svc: svc, bkdDb: bkdDb}
}

func (h *StatistikHandler) GetStatistik(c *gin.Context) {
	list, lastUpdated, err := h.svc.GetStatistik()
	if err != nil {
		c.JSON(500, gin.H{"error": "Gagal mengambil data statistik: " + err.Error()})
		return
	}

	var updatedStr string
	if !lastUpdated.IsZero() {
		updatedStr = lastUpdated.Format("2006-01-02 15:04:05")
	}

	c.JSON(200, gin.H{
		"data":         list,
		"last_updated": updatedStr,
	})
}

func (h *StatistikHandler) Sync(c *gin.Context) {
	if h.bkdDb == nil {
		c.JSON(500, gin.H{"error": "Database BKD (bkd_db) tidak terhubung"})
		return
	}

	list, lastUpdated, err := h.svc.SyncFromBkd(h.bkdDb)
	if err != nil {
		c.JSON(500, gin.H{"error": "Gagal sinkronisasi data dari BKD: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message":      "Sinkronisasi data statistik berhasil",
		"last_updated": lastUpdated.Format("2006-01-02 15:04:05"),
		"data":         list,
	})
}
