import React                         from 'react';
import { createSelector }            from '@reduxjs/toolkit'
import { RootState, useAppSelector } from '@/store';
import { AlertType }                 from '@/types/ui';
import { cn }                        from '@/utils/tailwind';

const selectAlert = createSelector(
	(state: RootState) => state.ui.alert,
	alert => alert // Only re-calculate if `alert` changes
);

export const Alert: React.FC = () => {
	const alert = useAppSelector(selectAlert)

	return (
		<div role='alert'
		     aria-live={ alert?.type === AlertType.ERROR ? 'assertive' : 'polite' }
		     aria-atomic='true'
		     className={ cn('w-full h-7 md:h-10 text-sm md:text-base text-center text-white dark:text-gray-100 p-1 md:p-2 shadow-md opacity-0 transition-opacity ease-in-out',
		                    {
			                    'opacity-100'                     : alert !== null,
			                    'bg-blue-500 dark:bg-blue-700'    : alert?.type === AlertType.INFO,
			                    'bg-yellow-500 dark:bg-yellow-700': alert?.type === AlertType.WARN,
			                    'bg-red-500 dark:bg-red-700'      : alert?.type === AlertType.ERROR
		                    }) }>
			<span className='sr-only'>
                { alert?.type.toLowerCase() } alert:
            </span>
			{ alert?.message }
		</div>
	);
}