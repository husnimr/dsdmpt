package repository

import (
	"dsdmpt-backend/internal/module/dsdmpt/entity"
	"time"

	"gorm.io/gorm"
)

type StatistikRepository interface {
	GetAll() ([]entity.Statistik, error)
	GetLastUpdated() (time.Time, error)
	ReplaceAll(stats []entity.Statistik) error
}

type statistikRepository struct {
	db *gorm.DB
}

func NewStatistikRepository(db *gorm.DB) StatistikRepository {
	return &statistikRepository{db: db}
}

func (r *statistikRepository) GetAll() ([]entity.Statistik, error) {
	var list []entity.Statistik
	// Order by kategori (dosen first, then tendik) and total descending
	err := r.db.Order("kategori ASC, total DESC, id ASC").Find(&list).Error
	return list, err
}

func (r *statistikRepository) GetLastUpdated() (time.Time, error) {
	var s entity.Statistik
	err := r.db.Order("updated_at DESC").First(&s).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return time.Time{}, nil
		}
		return time.Time{}, err
	}
	return s.UpdatedAt, nil
}

func (r *statistikRepository) ReplaceAll(stats []entity.Statistik) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Clear existing rows and restart sequence keys
		if err := tx.Exec("TRUNCATE TABLE statistik RESTART IDENTITY").Error; err != nil {
			return err
		}
		if len(stats) == 0 {
			return nil
		}
		// Create batch insert
		return tx.Create(&stats).Error
	})
}
