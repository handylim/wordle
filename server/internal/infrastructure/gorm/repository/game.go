package repository

import (
	`context`
	`fmt`

	`gorm.io/gorm`

	`wordle/internal/model`
	types `wordle/internal/model/type`
)

func NewGameRepository(db *gorm.DB) GameRepository {
	return &repository{db}
}

func (repo *repository) SaveGame(ctx context.Context, game *model.Game) error {
	if err := repo.GetDbInstance(ctx).Save(game).Error; err != nil {
		return fmt.Errorf("failed to create a new game record: %w", err)
	}
	return nil
}

func (repo *repository) QueryGame(ctx context.Context, gameId types.ULID, withGuesses bool) (*model.Game, error) {
	db := repo.GetDbInstance(ctx)
	if withGuesses {
		db = db.Preload("Guesses")
	}

	var game model.Game
	if err := db.First(&game, gameId).Error; err != nil {
		return nil, fmt.Errorf("failed to query game record: %w", err)
	}

	return &game, nil
}