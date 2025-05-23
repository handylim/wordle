export interface GameState { // store the game state
	id: string
	status: GameStatus
	maxRounds: number
	currentGuess: Array<Letter>
	currentRound: number
	guesses: Array<Guess>
}

export const letters = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
	'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
] as const;

export type Letter = typeof letters[number];

export type LetterStatus = {
	letter: Letter;
	status: LetterStatusType;
};

export type Guess = Array<LetterStatus>

export enum LetterStatusType {
	HIT     = 'HIT',
	PRESENT = 'PRESENT',
	MISS    = 'MISS'
}

export enum GameStatus {
	IDLE    = 'IDLE', // before game starts
	WON     = 'WON', // player guess the word before running out of chances
	LOST    = 'LOST', // player failed to guess the word before running out of chances
	PLAYING = 'PLAYING' // in-game
}