package response

import types `wordle/internal/model/type`

type StartGame struct {
	ID        types.ULID       `json:"id"`
	Status    types.GameStatus `json:"status"`
	MaxRounds int              `json:"maxRounds"`
}