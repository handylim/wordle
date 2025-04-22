package types

import (
	`database/sql/driver`
	`errors`
	`fmt`
)

type GameStatus string

const (
	GameStatusWon     GameStatus = "WON"
	GameStatusLost    GameStatus = "LOST"
	GameStatusPlaying GameStatus = "PLAYING"
)

func (state GameStatus) GormDataType() string {
	return "game_status"
}

func (state GameStatus) IsValid() bool {
	switch state {
	case GameStatusWon, GameStatusLost, GameStatusPlaying:
		return true
	default:
		return false
	}
}

func (state *GameStatus) Scan(src interface{}) error {
	if src == nil {
		return errors.New("cannot Scan nil into GameStatus")
	}

	strSrc, ok := src.(string)
	if !ok {
		return fmt.Errorf("cannot Scan type %T into GameStatus", src)
	}

	parsed := GameStatus(strSrc)
	if !parsed.IsValid() {
		return fmt.Errorf("invalid GameStatus Scan: %s", strSrc)
	}

	*state = parsed
	return nil
}

func (state GameStatus) Value() (driver.Value, error) {
	if state.IsValid() {
		return string(state), nil
	}

	return nil, fmt.Errorf("invalid GameStatus Value: %s", state)
}

func (state GameStatus) String() (string, error) {
	if state.IsValid() {
		return string(state), nil
	}

	return "INVALID_GAME_STATUS", fmt.Errorf("invalid GameStatus: %s", state)
}