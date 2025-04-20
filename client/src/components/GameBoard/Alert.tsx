import React              from 'react';
import { useAppSelector } from '@/store';
import { cn }             from '@/utils/tailwind';

export const Alert: React.FC = () => {
	const alert = useAppSelector(state => state.game.alert)

	return (
		<div className={ cn('w-full h-7 md:h-10 text-sm md:text-base text-center text-white dark:text-gray-100 p-1 md:p-2 shadow-md opacity-0 transition-opacity ease-in-out',
		                    {
			                    'opacity-100'                     : alert !== null,
			                    'bg-blue-500 dark:bg-blue-700'    : alert?.type === 'INFO',
			                    'bg-yellow-500 dark:bg-yellow-700': alert?.type === 'WARN',
			                    'bg-red-500 dark:bg-red-700'      : alert?.type === 'ERROR'
		                    }) }>
			{ alert?.message }
		</div>
	);
}