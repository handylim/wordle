package errors

type Error struct {
	HttpCode int
	Module   string
	message  string
	err      error
}

func (e *Error) Error() string {
	return e.message
}

func (e *Error) Unwrap() error {
	return e.err
}

func NewError(httpCode int, module, message string, error error) error {
	return &Error{
		HttpCode: httpCode,
		Module:   module,
		message:  message,
		err:      error,
	}
}