import React                                         from 'react';
import { useHotkeys }                                from 'react-hotkeys-hook';
import { createSelector }                            from '@reduxjs/toolkit'
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { addLetter, removeLetter, submitGuess }      from '@/store/features/game/thunk';
import { Row }                                       from '@/components/GameBoard/Row';
import { GameStatus, Letter, letters }               from '@/types/game';

const selectGame = createSelector(
	(state: RootState) => state.game,
	game => ({
		status      : game.status,
		maxRounds   : game.maxRounds,
		currentGuess: game.currentGuess,
		currentRound: game.currentRound,
		guesses     : game.guesses
	})
);

export const GameBoard: React.FC = () => {
	const game     = useAppSelector(selectGame)
	const dispatch = useAppDispatch()

	useHotkeys(['enter', 'backspace', ...letters],
	           e => {
		           const letter = e.key; // all in lowercase
		           switch (letter) {
			           case 'Enter':
				           dispatch(submitGuess())
				           break;
			           case 'Backspace':
				           dispatch(removeLetter())
				           break;
			           default:
				           dispatch(addLetter(letter as Letter))
		           }
	           })

	return (
		<div role='grid'
		     aria-label='Game board'
		     className='grid grid-rows-6 gap-2 mt-4'>
			{
				Array.from({ length: game.maxRounds })
				     .map((_, rowIndex) =>
					          <Row key={ rowIndex }
					               rowIndex={ rowIndex + 1 }
					               guess={ game.guesses[rowIndex] }
					               currentGuess={ game.currentRound === rowIndex + 1 ? game.currentGuess.join('') : '' }
					               isActive={ game.status === GameStatus.PLAYING && game.currentRound === rowIndex + 1 } />)
			}
		</div>
	);
}