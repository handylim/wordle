import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore }                                 from '@reduxjs/toolkit';
import { gameApi }                                        from '@/services/game';
import gameSlice                                          from '@/store/features/game/slice';
import uiSlice                                            from '@/store/features/ui/slice';

export const store = configureStore({
	                                    reducer   : {
		                                    [gameApi.reducerPath]: gameApi.reducer,
		                                    game                 : gameSlice.reducer,
		                                    ui                   : uiSlice.reducer
	                                    },
	                                    middleware: getDefaultMiddleware =>
		                                    getDefaultMiddleware().concat(gameApi.middleware)
                                    })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch                                  = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector