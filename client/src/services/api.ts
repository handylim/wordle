import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
	                      reducerPath: 'api/game',
	                      baseQuery  : fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}/v1` }),
	                      // endpoints will be injected in feature-specific files (e.g. services/game.ts)
	                      endpoints: build => ({}) // Empty base for code splitting
                      })

export { api }