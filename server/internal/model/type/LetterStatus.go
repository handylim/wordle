package types

import (
	`database/sql/driver`
	`errors`
	`fmt`

	`github.com/lib/pq`
)

type LetterStatus string

const (
	LetterStatusHit     LetterStatus = "HIT"
	LetterStatusPresent LetterStatus = "PRESENT"
	LetterStatusMiss    LetterStatus = "MISS"
)

func (ls LetterStatus) IsValid() bool {
	switch ls {
	case LetterStatusHit, LetterStatusPresent, LetterStatusMiss:
		return true
	default:
		return false
	}
}

func (ls *LetterStatus) Scan(src interface{}) error {
	if src == nil {
		return errors.New("cannot Scan nil into LetterStatus")
	}

	strSrc, ok := src.(string)
	if !ok {
		return fmt.Errorf("cannot Scan type %T to string", src)
	}

	parsed := LetterStatus(strSrc)
	if !parsed.IsValid() {
		return fmt.Errorf("invalid LetterStatus Scan: %s", strSrc)
	}

	*ls = parsed
	return nil
}

func (ls LetterStatus) Value() (driver.Value, error) {
	if ls.IsValid() {
		return string(ls), nil
	}

	return nil, fmt.Errorf("invalid LetterStatus Value: %s", ls)
}

func (ls LetterStatus) String() (string, error) {
	if ls.IsValid() {
		return string(ls), nil
	}

	return "INVALID_LETTER_STATUS", fmt.Errorf("invalid LetterStatus: %s", ls)
}

type LetterStatuses []LetterStatus

func (ls LetterStatuses) GormDataType() string {
	return "letter_status[]"
}

func (ls *LetterStatuses) Scan(src interface{}) error {
	if src == nil {
		return errors.New("cannot Scan nil into LetterStatuses")
	}

	var letterStatuses []string
	if err := pq.Array(&letterStatuses).Scan(src); err != nil {
		return fmt.Errorf("pq.Array scan failed: %w", err)
	}

	temp := make([]LetterStatus, len(letterStatuses))
	for i, l := range letterStatuses {
		letterStatus := LetterStatus(l)
		if !letterStatus.IsValid() {
			return fmt.Errorf("invalid LetterStatus Scan %q at index %d (full array: %v)", l, i, letterStatuses)
		}
		temp[i] = letterStatus
	}

	*ls = temp

	return nil
}

func (ls LetterStatuses) Value() (driver.Value, error) {
	if len(ls) == 0 {
		return pq.Array([]LetterStatus{}).Value()
	}

	temp := make([]string, len(ls))
	for i, l := range ls {
		if !l.IsValid() {
			return nil, fmt.Errorf("invalid LetterStatus Value %q at index %d (full array: %v)", l, i, ls)
		}
		temp[i] = string(l)
	}

	return pq.Array(temp).Value()
}