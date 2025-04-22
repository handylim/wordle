import React                from 'react';
import { cn }               from '@/utils/tailwind';
import { LetterStatusType } from '@/types/game';

interface TileProps {
	letter: string;
	rowIndex: number;
	colIndex: number;
	status?: LetterStatusType;
	isActive: boolean;
}

export const Tile: React.FC<TileProps> = React.memo(props =>
	                                                    <div role='gridcell'
	                                                         aria-colindex={ props.colIndex }
	                                                         aria-label={ props.letter }
	                                                         className={ cn('tile',
	                                                                        {
		                                                                        'tile--miss'   : props.status === LetterStatusType.MISS,
		                                                                        'tile--present': props.status === LetterStatusType.PRESENT,
		                                                                        'tile--hit'    : props.status === LetterStatusType.HIT,
		                                                                        'is-active'    : props.isActive
	                                                                        }) }>
		                                                    { props.letter }

		                                                    <span className='sr-only'>
			                                                    {
				                                                    (() => {
					                                                    switch (props.status) {
						                                                    case 'HIT':
							                                                    return 'Correct position'
						                                                    case 'PRESENT':
							                                                    return 'Wrong position'
						                                                    default:
							                                                    return 'Not in word'
					                                                    }
				                                                    })()
			                                                    }
		                                                    </span>
	                                                    </div>
);