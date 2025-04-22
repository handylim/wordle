import { createFileRoute } from '@tanstack/react-router'
import { HomeComponent }   from '@/components/pages/Home'

export const Route = createFileRoute('/')({
	                                          component : HomeComponent,
	                                          staticData: {
		                                          header: 'Welcome to Wordle'
	                                          },
	                                          head      : ctx => {
		                                          return {
			                                          meta: [
				                                          {
					                                          title: 'Welcome to Wordle'
				                                          }
			                                          ]
		                                          }
	                                          }
                                          })