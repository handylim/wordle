import { useEffect }                      from 'react';
import { ToggleButton }                   from 'react-aria-components';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme }                    from '@/store/features/ui/slice';

export const ColorSchemeToggle = () => {
	const ui       = useAppSelector(state => state.ui)
	const dispatch = useAppDispatch()

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', ui.theme);
		localStorage.setItem('theme', ui.theme);
	}, [ui.theme]);

	const _handleToggleColorScheme = (isSelected: boolean) => {
		dispatch(toggleTheme())
	}

	return (
		<ToggleButton onChange={ _handleToggleColorScheme }
		              isSelected={ ui.theme === 'dark' }
		              aria-label={ ui.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode' }
		              className='absolute top-1/2 -translate-y-1/2 right-2.5 md:right-5 border-1 border-gray-400 dark:border-gray-600 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200 cursor-pointer'>
			{ ui.theme === 'dark' ? '☀️' : '🌙' }
		</ToggleButton>
	);
};