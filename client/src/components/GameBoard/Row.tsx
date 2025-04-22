import React     from 'react';
import { Tile }  from '@/components/GameBoard/Tile';
import { Guess } from '@/types/game';

interface RowProps {
	guess?: Guess;
	rowIndex: number;
	currentGuess: string;
	isActive: boolean;
}

export const Row: React.FC<RowProps> = React.memo(props => {
	const tiles = Array.from({ length: 5 })
	                   .map((_, colIndex) => {
		                   const letterStatus = props.guess?.[colIndex]

		                   const letter = letterStatus?.letter || props.currentGuess[colIndex] || '';
		                   const status = letterStatus?.status;

		                   return <Tile key={ colIndex }
		                                rowIndex={ props.rowIndex }
		                                colIndex={ colIndex }
		                                letter={ letter.toUpperCase() }
		                                status={ status }
		                                isActive={ props.isActive && props.currentGuess.length === colIndex } />;
	                   });

	return (
		<div role='row'
		     aria-rowindex={ props.rowIndex }
		     className='grid grid-cols-5 gap-2'>
			{ tiles }
		</div>
	);
});