package request

import (
	types `wordle/internal/model/type`
)

type SubmitGuess struct {
	GameID types.ULID `json:"gameId" validate:"required,ulid"`
	Word   string     `json:"word" validate:"required,alpha,len=5"`
}