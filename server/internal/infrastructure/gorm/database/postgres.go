package database

import (
	`fmt`

	`gorm.io/gorm`

	`wordle/configuration`
	`wordle/internal/logger`
	`wordle/internal/model`
)

func NewDB(dialector gorm.Dialector) (*gorm.DB, error) {
	db, err := gorm.Open(dialector, &gorm.Config{
		SkipDefaultTransaction: true, // for a more fine-tune control
	})
	if err != nil {
		return nil, err
	}

	if configuration.IsDevelopment() {
		db = db.Debug()
	}

	if err = db.AutoMigrate(&model.Game{}, &model.Guess{}); err != nil {
		return nil, fmt.Errorf("fail to run the migration: %w", err)
	} else {
		logger.WithModule("database").
			Info("Auto migration completed successfully")
	}

	return db, nil
}