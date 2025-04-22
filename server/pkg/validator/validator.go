package validator

import (
	`github.com/go-playground/validator/v10`
)

var validate *validator.Validate

func init() {
	validate = validator.New(validator.WithRequiredStructEnabled())
}

func Struct(s interface{}) error {
	return validate.Struct(s)
}