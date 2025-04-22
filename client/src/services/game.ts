import { api }                                    from '@/services/api'
import { StartGameResponse, SubmitGuessResponse } from '@/types/dto/response/game';
import { SubmitGuessRequest }                     from '@/types/dto/request/game';

const gameApi = api.injectEndpoints({
	                                    endpoints: builder => ({
		                                    startGame  : builder.query<StartGameResponse, void>({
			                                                                                        query: () => 'single-player/start'
		                                                                                        }),
		                                    submitGuess: builder.mutation<SubmitGuessResponse, SubmitGuessRequest>({
			                                                                                                           query: body => ({
				                                                                                                           url   : 'single-player/submit',
				                                                                                                           method: 'POST',
				                                                                                                           body
			                                                                                                           })
		                                                                                                           })
	                                    })
                                    })

export { gameApi }