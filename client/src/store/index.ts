import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore }                                 from '@reduxjs/toolkit';
import gameSlice                                          from '@/store/features/game/slice';
import uiSlice                                            from '@/store/features/ui/slice';

export const store = configureStore({
	                                    reducer: {
		                                    game: gameSlice.reducer,
		                                    ui  : uiSlice.reducer
	                                    }
                                    })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch                                  = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector