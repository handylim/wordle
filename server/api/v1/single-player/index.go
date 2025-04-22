package single_player

import (
	`strings`

	`github.com/gofiber/fiber/v2`
	`github.com/samber/lo`

	`wordle/internal/model`
	`wordle/internal/model/dto/request`
	`wordle/internal/model/dto/response`
	types `wordle/internal/model/type`
	`wordle/internal/service`
	`wordle/pkg/errors`
)

func Handler(router fiber.Router, gameService service.GameService) {
	router.Get("/start", func(ctx *fiber.Ctx) error {
		if game, err := gameService.StartGame(ctx.UserContext()); err != nil {
			return errors.NewError(fiber.StatusInternalServerError, "single-player", "Failed to start game", err)
		} else {
			return ctx.JSON(response.StartGame{
				ID:        game.ID,
				Status:    game.Status,
				MaxRounds: game.MaxRounds,
			})
		}
	})

	router.Post("/submit", func(ctx *fiber.Ctx) error {
		reqBody := request.SubmitGuess{}
		if err := ctx.BodyParser(&reqBody); err != nil {
			return errors.NewError(fiber.StatusBadRequest, "single-player", "Failed to parse request body", err)
		}

		game, err := gameService.SubmitGuess(ctx.UserContext(), reqBody)
		if err != nil {
			return errors.NewError(fiber.StatusInternalServerError, "single-player", "Failed to submit guess", err)
		}

		return ctx.JSON(response.SubmitGuess{
			Answer: lo.Ternary(game.Status == types.GameStatusWon || game.Status == types.GameStatusLost, &game.Answer, nil),
			Status: game.Status,
			Guesses: lo.Map(game.Guesses, func(guess model.Guess, index int) response.Guess {
				letters := strings.Split(guess.Word, "")
				result := make(response.Guess, len(letters))

				for i := 0; i < len(letters); i++ {
					result[i] = response.LetterStatus{
						Letter: letters[i],
						Status: guess.LetterStatuses[i],
					}
				}

				return result
			}),
		})
	})
}