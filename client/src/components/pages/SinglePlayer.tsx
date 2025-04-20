import React, { useEffect }               from 'react';
import { PressEvent }                     from 'react-aria';
import { Button }                         from 'react-aria-components'
import { useBlocker }                     from '@tanstack/react-router';
import { useAppDispatch, useAppSelector } from '@/store';
import { resetGame, startGame }           from '@/store/features/game/slice';
import { GameBoard }                      from '@/components/GameBoard';
import { GameStatus }                     from '@/types/game';

export const SinglePlayerComponent = () => {
	const game     = useAppSelector(state => state.game)
	const dispatch = useAppDispatch()

	const _handleRestartGame = (e: PressEvent) => {
		dispatch(resetGame())
		dispatch(startGame())
	}

	useEffect(() => {
		dispatch(startGame())
	}, [])

	useBlocker({
		           shouldBlockFn: args => {
			           dispatch(resetGame())
			           return false
		           }
	           })

	return (
		<main className='flex flex-col items-center justify-center-safe gap-10 grow w-full'>
			<GameBoard />
			{
				(game.status === GameStatus.WIN || game.status === GameStatus.LOSE) &&
				<Button onPress={ _handleRestartGame }
				        className='btn btn-primary'>
					{ game.status === GameStatus.WIN ? 'Play Again' : 'Restart Game' }
				</Button>
			}
		</main>
	);
}