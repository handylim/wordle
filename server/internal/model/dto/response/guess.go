package response

import (
	types `wordle/internal/model/type`
)

type Guess []LetterStatus
type LetterStatus struct { // make sure it's in sync with front-end's `Guess` type
	Letter string             `json:"letter"` // 1 letter
	Status types.LetterStatus `json:"status"`
}

type SubmitGuess struct {
	Answer  *string          `json:"answer"` // only show when game is won or lost
	Status  types.GameStatus `json:"status"`
	Guesses []Guess          `json:"guesses"`
}