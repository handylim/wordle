import { createFileRoute }       from '@tanstack/react-router';
import { SinglePlayerComponent } from '@/components/pages/SinglePlayer'

export const Route = createFileRoute('/single-player')({
	                                                       component : SinglePlayerComponent,
	                                                       staticData: {
		                                                       header: 'Wordle'
	                                                       },
	                                                       head      : ctx => {
		                                                       return {
			                                                       meta: [
				                                                       {
					                                                       title: 'Wordle (Single Player)'
				                                                       }
			                                                       ]
		                                                       }
	                                                       }
                                                       })