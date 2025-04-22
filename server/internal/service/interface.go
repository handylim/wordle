package service

import (
	`context`

	`wordle/internal/model`
	`wordle/internal/model/dto/request`
)

type GameService interface {
	StartGame(context.Context) (*model.Game, error)
	SubmitGuess(context.Context, request.SubmitGuess) (*model.Game, error)
}