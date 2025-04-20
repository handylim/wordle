import { createSlice, PayloadAction }                             from '@reduxjs/toolkit';
import { ulid }                                                   from 'ulid';
import { GameState, GameStatus, Guess, Letter, LetterStatusType } from '@/types/game';

const initialState: GameState = {
	id          : '',
	status      : GameStatus.IDLE,
	maxRounds   : import.meta.env.VITE_ROUNDS,
	answer      : '',
	currentGuess: [],
	currentRound: 0,
	guesses     : [],
	alert       : null
}

const gameSlice = createSlice({
	                              name    : 'game',
	                              initialState,
	                              reducers: {
		                              startGame   : state => {
			                              state.id           = ulid()
			                              state.status       = GameStatus.PLAYING
			                              state.currentRound = 1
			                              state.answer       = import.meta.env.VITE_WORDS[Math.floor(Math.random() * import.meta.env.VITE_WORDS.length)]
		                              },
		                              resetGame   : () => initialState,
		                              addLetter   : (state, action: PayloadAction<Letter>) => {
			                              if (state.status === GameStatus.PLAYING && state.currentGuess.length < 5) {
				                              state.alert = null
				                              state.currentGuess.push(action.payload)
			                              }
		                              },
		                              removeLetter: state => {
			                              if (state.status === GameStatus.PLAYING && state.currentGuess.length > 0) {
				                              state.alert = null
				                              state.currentGuess.pop()
			                              }
		                              },
		                              submitGuess : state => {
			                              if (state.status !== GameStatus.PLAYING)
				                              return

			                              if (state.currentGuess.length < 5) {
				                              state.alert = {
					                              type   : 'WARN',
					                              message: 'Not enough letters'
				                              }
				                              return
			                              }

			                              const guess: Guess  = []
			                              const answerLetters = state.answer.split('') as Array<Letter>

			                              const letterCounts: Record<string, number> = {}

			                              for (const letter of answerLetters)
				                              letterCounts[letter] = (letterCounts[letter] || 0) + 1

			                              // First pass: mark 'HIT' letters and decrease counts
			                              for (let i = 0; i < state.currentGuess.length; i++) {
				                              const guessedLetter = state.currentGuess[i];
				                              if (guessedLetter === answerLetters[i]) {
					                              guess[i] = {
						                              letter: guessedLetter,
						                              status: LetterStatusType.HIT
					                              };
					                              letterCounts[guessedLetter]--;
				                              }
				                              else
					                              guess[i] = {
						                              letter: guessedLetter,
						                              status: null as any // placeholder for second pass
					                              };
			                              }

			                              // Second pass: mark 'PRESENT' and 'MISS' letters
			                              for (let i = 0; i < guess.length; i++) {
				                              if (guess[i].status === LetterStatusType.HIT)
					                              continue;

				                              const guessedLetter = state.currentGuess[i];
				                              if (letterCounts[guessedLetter]) {
					                              guess[i].status = LetterStatusType.PRESENT;
					                              letterCounts[guessedLetter]--;
				                              }
				                              else
					                              guess[i].status = LetterStatusType.MISS;
			                              }

			                              if (guess.every(letterStatus => letterStatus.status === LetterStatusType.HIT)) {
				                              state.status = GameStatus.WIN
				                              state.alert  = {
					                              type   : 'INFO',
					                              message: 'Great, you guessed the word correctly'
				                              }
			                              }
			                              else {
				                              if (state.currentRound === state.maxRounds) {
					                              state.status = GameStatus.LOSE
					                              state.alert  = {
						                              type   : 'WARN',
						                              message: `Oh, no! The word that you're looking for is ${state.answer.toUpperCase()}`
					                              }
				                              }
			                              }

			                              state.currentRound += 1
			                              state.guesses.push(guess)
			                              state.currentGuess = []
		                              }
	                              }
                              })

export const { startGame, resetGame, addLetter, removeLetter, submitGuess } = gameSlice.actions

export default gameSlice