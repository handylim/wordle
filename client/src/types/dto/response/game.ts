import { GameStatus, Guess } from '@/types/game';

export type StartGameResponse = {
	id: string
	status: GameStatus
	maxRounds: number
}

export type SubmitGuessResponse = {
	answer?: string // only available when status === WON || LOST
	status: GameStatus
	guesses: Array<Guess>
}