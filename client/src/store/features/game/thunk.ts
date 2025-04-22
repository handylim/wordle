import { gameApi }                   from '@/services/game';
import { AppDispatch, RootState }    from '@/store';
import { clearAlert, showAlert }     from '@/store/features/ui/slice';
import { _addLetter, _removeLetter } from '@/store/features/game/slice';
import { GameStatus, Letter }        from '@/types/game';
import { AlertType }                 from '@/types/ui';

const startGame = () => async (dispatch: AppDispatch, getState: () => RootState) => {
	try {
		await dispatch(gameApi.endpoints.startGame.initiate(undefined, { forceRefetch: true })).unwrap()
	}
	catch (error) {
		dispatch(showAlert({
			                   type   : AlertType.ERROR,
			                   message: 'Network error – please try again.'
		                   }))
	}
}

const addLetter = (letter: Letter) => (dispatch: AppDispatch, getState: () => RootState) => {
	const { game } = getState()
	if (game.status === GameStatus.PLAYING && game.currentGuess.length < 5) {
		dispatch(clearAlert())
		dispatch(_addLetter(letter))
	}
}

const removeLetter = () => (dispatch: AppDispatch, getState: () => RootState) => {
	const { game } = getState()
	if (game.status === GameStatus.PLAYING && game.currentGuess.length > 0) {
		dispatch(clearAlert())
		dispatch(_removeLetter())
	}
}

const submitGuess = () => async (dispatch: AppDispatch, getState: () => RootState) => {
	const { game } = getState()

	if (game.status !== GameStatus.PLAYING)
		return

	if (game.currentGuess.length < 5) {
		dispatch(showAlert({
			                   type   : AlertType.WARN,
			                   message: 'Not enough letters'
		                   }))
		return
	}

	try {
		const resp = await dispatch(gameApi.endpoints.submitGuess.initiate({
			                                                                   gameId: game.id,
			                                                                   word  : game.currentGuess.join('')
		                                                                   })).unwrap()

		switch (resp.status) {
			case GameStatus.WON:
				dispatch(showAlert({
					                   type   : AlertType.INFO,
					                   message: '🎉 Nice! you guessed the word correctly'
				                   }))
				break;
			case GameStatus.LOST:
				dispatch(showAlert({
					                   type   : AlertType.WARN,
					                   message: `Oh, no! The word that you're looking for is ${resp.answer!.toUpperCase()}`
				                   }))
		}
	}
	catch (error) {
		dispatch(showAlert({
			                   type   : AlertType.ERROR,
			                   message: 'Network error – please try again.'
		                   }))
	}
}

export { startGame, addLetter, removeLetter, submitGuess }