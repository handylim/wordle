package main

import (
	`errors`
	`fmt`
	`os`
	`os/signal`
	`syscall`
	`time`

	`github.com/goccy/go-json`
	`github.com/gofiber/fiber/v2`
	`github.com/gofiber/fiber/v2/log`
	`github.com/gofiber/fiber/v2/middleware/cors`
	`github.com/gofiber/fiber/v2/middleware/helmet`
	fiberLogger `github.com/gofiber/fiber/v2/middleware/logger`
	`github.com/gofiber/fiber/v2/middleware/recover`
	`github.com/gofiber/fiber/v2/middleware/requestid`
	`github.com/lmittmann/tint`
	`gorm.io/driver/postgres`
	`gorm.io/gorm`

	v1 `wordle/api/v1`
	`wordle/configuration`
	`wordle/internal/infrastructure/gorm/database`
	`wordle/internal/infrastructure/gorm/repository`
	`wordle/internal/logger`
	`wordle/internal/service`
	appError `wordle/pkg/errors`
)

func main() {
	app := fiber.New(fiber.Config{
		AppName:     "Wordle",
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
		ReadTimeout: configuration.TimeoutDuration(),
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError

			var e *appError.Error
			if errors.As(err, &e) {
				code = e.HttpCode
				logger.WithFiberContext(ctx, e.Module).Error(e.Error(), tint.Err(e.Unwrap()))
			}

			tx, ok := ctx.UserContext().Value(repository.PostgresTransaction).(*gorm.DB)
			if ok && tx.RowsAffected > 0 {
				tx.Rollback()
			}

			ctx.Set(fiber.HeaderContentType, fiber.MIMETextPlainCharsetUTF8)
			return ctx.Status(code).SendString(e.Error())
		},
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: configuration.CORSAllowedOrigins(),
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	app.Use(recover.New(recover.Config{EnableStackTrace: true}))
	app.Use(fiberLogger.New(fiberLogger.Config{TimeFormat: time.DateTime}))
	app.Use(requestid.New(requestid.Config{ContextKey: "request-id"}))
	app.Use(helmet.New())

	db, err := database.NewDB(postgres.Open(configuration.GetDSN()))
	if err != nil {
		log.Fatal("failed to make connection to db", err)
	}

	gameRepository := repository.NewGameRepository(db)

	gameConfig := configuration.GetGame()

	gameService := service.NewGameService(gameRepository, gameConfig)

	api := app.Group("/api")
	v1.Handler(api.Group("v1"), gameService)

	go func() {
		if err := app.Listen(fmt.Sprintf(":%d", configuration.Port())); err != nil {
			log.Fatal("failed to start server", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	<-quit

	if sqlDb, err := db.DB(); err == nil {
		if err := sqlDb.Close(); err != nil {
			log.Error("Failed to close database connection", err)
		}
	}

	if err := app.ShutdownWithTimeout(10 * time.Second); err != nil {
		log.Error("Failed to shutdown server", err)
		os.Exit(1)
	}
}