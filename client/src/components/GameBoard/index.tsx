import React                                    from 'react';
import { useHotkeys }                           from 'react-hotkeys-hook';
import { useAppDispatch, useAppSelector }       from '@/store';
import { addLetter, removeLetter, submitGuess } from '@/store/features/game/slice';
import { Letter, letters, LetterStatusType }    from '@/types/game';
import { cn }                                   from '@/utils/tailwind';

export const GameBoard: React.FC = () => {
	const game     = useAppSelector(state => state.game)
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
					          <div key={ rowIndex }
					               role='row'
					               aria-rowindex={ rowIndex + 1 }
					               className='grid grid-cols-5 gap-2'>
						          {
							          Array.from({ length: game.answer.length })
							               .map((_, colIndex) =>
								                    <div key={ colIndex }
								                         role='gridcell'
								                         aria-colindex={ colIndex + 1 }
								                         aria-label={ `Cell ${rowIndex + 1}-${colIndex + 1}` }
								                         className={ cn('tile',
								                                        {
									                                        'tile--miss'   : game.guesses[rowIndex]?.[colIndex].status === LetterStatusType.MISS,
									                                        'tile--present': game.guesses[rowIndex]?.[colIndex].status === LetterStatusType.PRESENT,
									                                        'tile--hit'    : game.guesses[rowIndex]?.[colIndex].status === LetterStatusType.HIT
								                                        }) }>
									                    {
										                    game.currentRound === (rowIndex + 1)
										                    ? game.currentGuess[colIndex]?.toUpperCase() ?? ''
										                    : game.guesses[rowIndex]?.[colIndex].letter.toUpperCase()
									                    }
								                    </div>)
						          }
					          </div>)
			}
		</div>
	);
}