package model

import (
	`gorm.io/gorm`

	`wordle/internal/model/type`
)

type Game struct {
	ID        types.ULID       `gorm:"primaryKey;default:gen_ulid()" json:"id"`
	Answer    string           `gorm:"type:char(5);not null" json:"answer"`
	Status    types.GameStatus `gorm:"not null" json:"status"`
	MaxRounds int              `gorm:"not null" json:"maxRounds"`
	Type      types.GameType   `gorm:"not null" json:"type"`
	Guesses   []Guess          `json:"guesses"`
}

func (g *Game) AfterFind(tx *gorm.DB) error {
	if g.Guesses == nil {
		g.Guesses = make([]Guess, 0)
	}
	return nil
}