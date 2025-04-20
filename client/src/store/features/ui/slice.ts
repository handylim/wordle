import { createSlice }   from '@reduxjs/toolkit';
import { UserInterface } from '@/types/ui';

const uiSlice = createSlice({
	                            name        : 'ui',
	                            initialState: (): UserInterface => {
		                            const storedTheme = localStorage.getItem('theme')
		                            if (storedTheme === 'light' || storedTheme === 'dark')
			                            return { theme: storedTheme }

		                            return {
			                            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		                            }
	                            },
	                            reducers    : {
		                            toggleTheme: state => {
			                            state.theme = state.theme === 'light' ? 'dark' : 'light'
		                            }
	                            }
                            })

export const { toggleTheme } = uiSlice.actions

export default uiSlice