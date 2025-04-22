package service

import (
	`context`
	`fmt`
	`math/rand`
	`strings`

	`github.com/samber/lo`

	`wordle/configuration`
	`wordle/internal/infrastructure/gorm/repository`
	`wordle/internal/model`
	`wordle/internal/model/dto/request`
	types `wordle/internal/model/type`
)

type gameService struct {
	repository repository.GameRepository
	config     configuration.Game
}

func NewGameService(repository repository.GameRepository, gameConfig configuration.Game) GameService {
	return &gameService{repository, gameConfig}
}

func (service *gameService) StartGame(ctx context.Context) (*model.Game, error) {
	game := model.Game{
		Answer:    service.config.Words[rand.Intn(len(service.config.Words))],
		Status:    types.GameStatusPlaying,
		MaxRounds: service.config.MaxRounds,
		Type:      types.GameTypeSinglePlayer,
	}

	ctx = service.repository.Begin(ctx)

	if err := service.repository.SaveGame(ctx, &game); err != nil {
		return nil, fmt.Errorf("failed to start game: %w", err)
	}

	if err := service.repository.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction to create game record: %w", err)
	}

	return &game, nil
}

func (service *gameService) SubmitGuess(ctx context.Context, req request.SubmitGuess) (*model.Game, error) {
	game, err := service.repository.QueryGame(ctx, req.GameID, true)
	if err != nil {
		return nil, fmt.Errorf("failed to query game to submit guess: %w", err)
	}

	if game.Status != types.GameStatusPlaying {
		return nil, fmt.Errorf("invalid game status: %s", game.Status)
	}

	totalGuesses := len(game.Guesses)
	if totalGuesses >= service.config.MaxRounds {
		return nil, fmt.Errorf("too many guesses: %d", totalGuesses)
	}

	letterCounts := make(map[string]int)
	for _, letter := range game.Answer {
		letterCounts[string(letter)]++
	}

	// First pass: Mark all direct hits
	letters := strings.Split(req.Word, "")
	letterStatuses := make([]types.LetterStatus, len(letters))
	for i, letter := range letters {
		if i < len(game.Answer) && letter == string(game.Answer[i]) {
			letterStatuses[i] = types.LetterStatusHit
			letterCounts[letter]--
		}
	}

	// Second pass: Mark present or miss
	for i, letter := range letters {
		if letterStatuses[i] == types.LetterStatusHit {
			continue
		}

		if letterCounts[letter] > 0 {
			letterStatuses[i] = types.LetterStatusPresent
			letterCounts[letter]--
		} else {
			letterStatuses[i] = types.LetterStatusMiss
		}
	}

	currentRound := totalGuesses + 1

	if lo.EveryBy(letterStatuses, func(letterStatus types.LetterStatus) bool {
		return letterStatus == types.LetterStatusHit
	}) {
		game.Status = types.GameStatusWon
	} else {
		if currentRound == service.config.MaxRounds {
			game.Status = types.GameStatusLost
		}
	}

	guess := model.Guess{
		GameID:         game.ID,
		Word:           req.Word,
		LetterStatuses: letterStatuses,
		PlayerID:       make(types.ULIDs, 0),
		RoundNo:        currentRound,
	}
	game.Guesses = append(game.Guesses, guess)

	ctx = service.repository.Begin(ctx)

	if err := service.repository.SaveGame(ctx, game); err != nil {
		return nil, fmt.Errorf("failed to create game and guesses: %w", err)
	}

	if err := service.repository.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction to create game and guess records: %w", err)
	}

	return game, nil
}