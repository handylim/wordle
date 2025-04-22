package configuration

import (
	`fmt`
	`strings`
	`time`
)

type Config struct {
	Server   Server
	Database Database
	Game     Game
}

type Server struct {
	Port               int      `mapstructure:"port" validate:"number,min=1,max=65535"`
	Timeout            int      `mapstructure:"timeout" validate:"number,min=1"`
	CORSAllowedOrigins []string `mapstructure:"cors_allowed_origins" validate:"min=1,dive,required,http_url"`
}

func Port() int {
	return config.Server.Port
}

func TimeoutDuration() time.Duration {
	return time.Duration(config.Server.Timeout) * time.Second
}

func CORSAllowedOrigins() string {
	return strings.Join(config.Server.CORSAllowedOrigins, ",")
}

type Database struct {
	Host         string `mapstructure:"host" validate:"hostname|ip"`
	Port         int    `mapstructure:"port" validate:"number,min=1,max=65535"`
	User         string `mapstructure:"user" validate:"required"`
	Password     string `mapstructure:"password" validate:"required"`
	Name         string `mapstructure:"name" validate:"required"`
	MaxOpenConns int    `mapstructure:"max_open_conns" validate:"number,min=0"`
	MaxIdleConns int    `mapstructure:"max_idle_conns" validate:"number,min=0"`
	SSLMode      string `mapstructure:"ssl_mode" validate:"oneof=disable require verify-ca verify-full"`
	TimeZone     string `mapstructure:"time_zone" validate:"timezone"`
}

func GetDSN() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s TimeZone=%s",
		config.Database.Host,
		config.Database.Port,
		config.Database.User,
		config.Database.Password,
		config.Database.Name,
		config.Database.SSLMode,
		config.Database.TimeZone)
}

type Game struct {
	MaxRounds int      `mapstructure:"max_rounds" validate:"number,min=1"`             // Number of rounds per game
	Words     []string `mapstructure:"words" validate:"min=1,unique,dive,alpha,len=5"` // List of valid five-letter words
}

func GetGame() Game { // return by values to prevent the caller from changing the central configuration state accidentally
	return config.Game
}