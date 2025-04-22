FROM golang:1.24.2-alpine3.21 AS builder

WORKDIR /go/src/fiber

# Copy go.mod and go.sum first to leverage Docker caching
COPY go.mod go.sum* ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -o wordle cmd/main.go


FROM alpine:3.21

ARG GO_ENV

# Add CA certificates and tzdata for proper HTTPS and timezone support
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /go/src/fiber

COPY --from=builder /go/src/fiber/configuration/default.toml configuration/default.toml
COPY --from=builder /go/src/fiber/configuration/${GO_ENV}/environment.toml configuration/${GO_ENV}/environment.toml
COPY --from=builder /go/src/fiber/wordle .

# Create a non-root user and set permissions
RUN addgroup -S wordle && \
    adduser -S wordle -G wordle && \
    chown -R wordle:wordle /go/src/fiber

# Use the non-root user
USER wordle

EXPOSE 8080