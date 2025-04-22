package types

import (
	`database/sql/driver`
	`errors`
	`fmt`
)

type GameType string

const (
	GameTypeSinglePlayer GameType = "SINGLE_PLAYER"
	GameTypeMultiPlayer  GameType = "MULTI_PLAYER"
)

func (gt GameType) GormDataType() string {
	return "game_type"
}

func (gt GameType) IsValid() bool {
	switch gt {
	case GameTypeSinglePlayer, GameTypeMultiPlayer:
		return true
	default:
		return false
	}
}

func (gt *GameType) Scan(src interface{}) error {
	if src == nil {
		return errors.New("cannot Scan nil into GameType")
	}

	strSrc, ok := src.(string)
	if !ok {
		return fmt.Errorf("cannot Scan type %T into GameType", src)
	}

	parsed := GameType(strSrc)
	if !parsed.IsValid() {
		return fmt.Errorf("invalid GameType Scan: %s", strSrc)
	}

	*gt = parsed
	return nil
}

func (gt GameType) Value() (driver.Value, error) {
	if gt.IsValid() {
		return string(gt), nil
	}

	return nil, fmt.Errorf("invalid GameType Value: %s", gt)
}

func (gt GameType) String() (string, error) {
	if gt.IsValid() {
		return string(gt), nil
	}

	return "INVALID_GAME_TYPE", fmt.Errorf("invalid GameType: %s", gt)
}