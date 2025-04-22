package v1

import (
	`github.com/gofiber/fiber/v2`

	`wordle/api/v1/single-player`
	`wordle/internal/service`
)

func Handler(router fiber.Router, gameService service.GameService) {
	router.Route("/single-player", func(router fiber.Router) {
		single_player.Handler(router, gameService)
	}, "v1")
}