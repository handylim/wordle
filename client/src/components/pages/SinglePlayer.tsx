import React, { useEffect }               from 'react';
import { PressEvent }                     from 'react-aria';
import { Button }                         from 'react-aria-components'
import { useBlocker }                     from '@tanstack/react-router';
import { useAppDispatch, useAppSelector } from '@/store';
import { resetGame }                      from '@/store/features/game/slice';
import { startGame }                      from '@/store/features/game/thunk';
import { clearAlert }                     from '@/store/features/ui/slice';
import { GameBoard }                      from '@/components/GameBoard';
import { GameStatus }                     from '@/types/game';

export const SinglePlayerComponent = () => {
	const game     = useAppSelector(state => state.game)
	const dispatch = useAppDispatch()

	const _handleRestartGame = (e: PressEvent) => {
		dispatch(clearAlert())
		dispatch(resetGame())
		dispatch(startGame())
	}

	useEffect(() => {
		dispatch(startGame())
	}, [])

	useBlocker({
		           shouldBlockFn: args => {
			           dispatch(clearAlert())
			           dispatch(resetGame())
			           return false
		           }
	           })

	return (
		<main className='flex flex-col items-center justify-center-safe gap-10 grow w-full'>
			<GameBoard />
			{
				(game.status === GameStatus.WON || game.status === GameStatus.LOST) &&
				<Button onPress={ _handleRestartGame }
				        className='btn btn-primary'>
					{ game.status === GameStatus.WON ? 'Play Again' : 'Restart Game' }
				</Button>
			}
		</main>
	);
}