import { createSlice, PayloadAction }    from '@reduxjs/toolkit';
import { gameApi }                       from '@/services/game';
import { GameState, GameStatus, Letter } from '@/types/game';

const initialState: GameState = {
	id          : '',
	status      : GameStatus.IDLE,
	maxRounds   : 0,
	currentGuess: [],
	currentRound: 0,
	guesses     : []
}

const gameSlice = createSlice({
	                              name         : 'game',
	                              initialState,
	                              reducers     : {
		                              resetGame    : () => initialState,
		                              _addLetter   : (state, action: PayloadAction<Letter>) => {
			                              state.currentGuess.push(action.payload)
		                              },
		                              _removeLetter: state => {
			                              state.currentGuess.pop()
		                              }
	                              },
	                              extraReducers: builder => {
		                              builder.addMatcher(gameApi.endpoints.startGame.matchFulfilled,
		                                                 (state, action) => {
			                                                 state.id           = action.payload.id
			                                                 state.status       = action.payload.status
			                                                 state.currentRound = 1
			                                                 state.maxRounds    = action.payload.maxRounds
		                                                 })
		                                     .addMatcher(gameApi.endpoints.submitGuess.matchFulfilled,
		                                                 (state, action) => {
			                                                 state.status       = action.payload.status
			                                                 state.currentRound += 1
			                                                 state.guesses      = action.payload.guesses
			                                                 state.currentGuess = []
		                                                 })
	                              }
                              })

export const { resetGame, _addLetter, _removeLetter } = gameSlice.actions

export default gameSlice