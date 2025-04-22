package model

import (
	`gorm.io/gorm`

	`wordle/internal/model/type`
)

type Guess struct {
	ID             types.ULID           `gorm:"primaryKey;default:gen_ulid()" json:"id"`
	GameID         types.ULID           `gorm:"not null" json:"gameId"`
	Word           string               `gorm:"type:char(5);not null" json:"word"`
	LetterStatuses types.LetterStatuses `gorm:"not null" json:"letterStatus"`
	PlayerID       types.ULIDs          `gorm:"not null" json:"playerId"`
	RoundNo        int                  `gorm:"type:smallint;not null;default:1" json:"roundNo"`
}

func (g *Guess) AfterFind(tx *gorm.DB) error {
	if g.PlayerID == nil {
		g.PlayerID = make(types.ULIDs, 0)
	}
	return nil
}