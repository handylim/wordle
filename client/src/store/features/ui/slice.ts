import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, UserInterface }       from '@/types/ui';

const uiSlice = createSlice({
	                            name        : 'ui',
	                            initialState: (): UserInterface => {
		                            const initialState = {
			                            alert: null
		                            }

		                            const storedTheme = localStorage.getItem('theme')
		                            if (storedTheme === 'light' || storedTheme === 'dark')
			                            return {
				                            ...initialState,
				                            theme: storedTheme
			                            }

		                            return {
			                            ...initialState,
			                            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		                            }
	                            },
	                            reducers    : {
		                            toggleTheme: state => {
			                            state.theme = state.theme === 'light' ? 'dark' : 'light'
		                            },
		                            showAlert  : (state, action: PayloadAction<Alert>) => {
			                            state.alert = action.payload
		                            },
		                            clearAlert : state => {
			                            state.alert = null
		                            }
	                            }
                            })

export const { toggleTheme, showAlert, clearAlert } = uiSlice.actions

export default uiSlice