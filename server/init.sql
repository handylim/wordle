CREATE EXTENSION IF NOT EXISTS pgx_ulid; -- because the ULID type can be stored as binary instead of string

CREATE TYPE GAME_STATUS AS ENUM ('WON', 'LOST', 'PLAYING');
CREATE TYPE GAME_TYPE AS ENUM ('SINGLE_PLAYER', 'MULTI_PLAYER');
CREATE TYPE LETTER_STATUS AS ENUM ('HIT', 'PRESENT', 'MISS');