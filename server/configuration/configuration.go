package configuration

import (
	`fmt`
	`sync`

	`github.com/gofiber/fiber/v2/log`
	`github.com/spf13/viper`

	`wordle/pkg/validator`
)

var (
	config      *Config
	environment string
	once        sync.Once
)

func init() {
	once.Do(func() {
		viper.AutomaticEnv()

		temp := viper.GetString("GO_ENV")
		switch temp {
		case "development", "test", "production":
			environment = temp
		case "":
			log.Fatal("GO_ENV environment variable not set")
		default:
			log.Fatalf("invalid GO_ENV environment: %s", temp)
		}

		viper.SetEnvPrefix("WORDLE")

		environmentBindings := map[string]string{
			"server.port":                 "WORDLE_SERVER_PORT",
			"server.timeout":              "WORDLE_SERVER_TIMEOUT",
			"server.cors_allowed_origins": "WORDLE_SERVER_CORS_ALLOWED_ORIGINS",
			"database.host":               "WORDLE_DATABASE_HOST",
			"database.port":               "WORDLE_DATABASE_PORT",
			"database.user":               "WORDLE_DATABASE_USER",
			"database.password":           "WORDLE_DATABASE_PASSWORD",
			"database.name":               "WORDLE_DATABASE_NAME",
			"database.max_open_conns":     "WORDLE_DATABASE_MAX_OPEN_CONNS",
			"database.max_idle_conns":     "WORDLE_DATABASE_MAX_IDLE_CONNS",
			"database.ssl_mode":           "WORDLE_DATABASE_SSL_MODE",
			"database.time_zone":          "WORDLE_DATABASE_TIME_ZONE",
			"game.max_rounds":             "WORDLE_GAME_MAX_ROUNDS",
		}

		for key, env := range environmentBindings {
			if err := viper.BindEnv(key, env); err != nil {
				log.Fatalf("failed to bind environment variable %s: %s", key, err)
			}
		}

		// load default (shared) config
		viper.SetConfigFile("configuration/default.toml")
		if err := viper.ReadInConfig(); err != nil {
			log.Fatalf("failed to merge configuration file: %s", err)
		}

		// load environment-specific config
		viper.SetConfigFile(fmt.Sprintf("configuration/%s/environment.toml", environment))
		if err := viper.MergeInConfig(); err != nil {
			log.Fatalf("failed to merge configuration file: %s", err)
		}

		if err := viper.Unmarshal(&config); err != nil {
			log.Fatalf("failed to unmarshal configuration: %s", err)
		}

		if err := validator.Struct(config); err != nil {
			log.Fatalf("invalid configuration: %s", err)
		}
	})
}

func IsDevelopment() bool {
	return environment == "development"
}