package repository

import (
	`context`

	`gorm.io/gorm`

	`wordle/internal/model`
	types `wordle/internal/model/type`
)

type BaseRepository interface {
	GetDbInstance(context.Context) *gorm.DB
	Begin(context.Context) context.Context
	Commit(context.Context) error
	Rollback(context.Context) error
}

type GameRepository interface {
	BaseRepository

	SaveGame(context.Context, *model.Game) error
	QueryGame(context.Context, types.ULID, bool) (*model.Game, error)
}