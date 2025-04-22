package types

import (
	"database/sql/driver"
	"errors"
	`fmt`

	`github.com/lib/pq`
	`github.com/oklog/ulid/v2`
)

type ULID ulid.ULID // a custom type for handling ULIDs in GORM

func (u ULID) GormDataType() string {
	return "ulid"
}

func (u *ULID) Scan(value interface{}) error {
	if value == nil {
		return errors.New("cannot scan nil value into ULID")
	}

	parsed, err := ulid.ParseStrict(value.(string))
	if err != nil {
		return err
	}

	*u = ULID(parsed)
	return nil
}

func (u ULID) Value() (driver.Value, error) {
	return ulid.ULID(u).String(), nil
}

func (u ULID) String() string {
	return ulid.ULID(u).String()
}

func (u ULID) MarshalJSON() ([]byte, error) {
	return []byte(`"` + u.String() + `"`), nil
}

func (u *ULID) UnmarshalJSON(data []byte) error {
	length := len(data) // ULID JSON format is: " + 26 characters + "
	if length < 28 || data[0] != '"' || data[length-1] != '"' {
		return errors.New("ulid: invalid JSON string")
	}

	parsed, err := ulid.Parse(string(data[1 : length-1]))
	if err != nil {
		return err
	}

	*u = ULID(parsed)
	return nil
}

type ULIDs []ulid.ULID

func (ulids ULIDs) GormDataType() string {
	return "ulid[]"
}

func (ulids *ULIDs) Scan(src interface{}) error {
	if src == nil {
		return errors.New("cannot Scan nil into ULIDs")
	}

	var ulidsString []string
	if err := pq.Array(&ulidsString).Scan(src); err != nil {
		return fmt.Errorf("pq.Array scan failed: %w", err)
	}

	temp := make([]ulid.ULID, len(ulidsString))
	for i, u := range ulidsString {
		if id, err := ulid.ParseStrict(u); err != nil {
			return fmt.Errorf("invalid ULID %s: %w", u, err)
		} else {
			temp[i] = id
		}
	}

	*ulids = temp

	return nil
}

func (ulids ULIDs) Value() (driver.Value, error) {
	if len(ulids) == 0 {
		return pq.Array([]string{}).Value()
	}

	temp := make([]string, len(ulids))
	for i, u := range ulids {
		temp[i] = u.String()
	}

	return pq.Array(temp).Value()
}