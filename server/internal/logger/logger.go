package logger

import (
	`log/slog`
	`os`

	`github.com/gofiber/fiber/v2`
	`github.com/lmittmann/tint`
	`github.com/samber/lo`

	`wordle/configuration`
)

var logger *slog.Logger

func init() {
	logger = slog.New(tint.NewHandler(os.Stdout, &tint.Options{
		AddSource:  true,
		Level:      lo.Ternary(configuration.IsDevelopment(), slog.LevelDebug, slog.LevelInfo),
		TimeFormat: "2006-01-02 15:04:05 -0700",
	}))
}

func WithModule(module string) *slog.Logger {
	return logger.With(slog.String("module", module))
}

func WithFiberContext(ctx *fiber.Ctx, module string) *slog.Logger {
	return logger.With(slog.String("module", module),
		slog.Any("context", ctx.UserContext()),
		slog.Group("request",
			slog.String("id", ctx.Locals("request-id").(string)),
			slog.String("ip", ctx.IP()),
			slog.String("user_agent", ctx.Get(fiber.HeaderUserAgent)),
			slog.String("method", ctx.Method()),
			slog.String("path", ctx.Path()),
			slog.String("query", string(ctx.Request().URI().QueryString()))))
}