import { createRootRoute, HeadContent, Outlet, useMatches } from '@tanstack/react-router';
import { TanStackRouterDevtools }                           from '@tanstack/react-router-devtools';
import { ColorSchemeToggle }                                from '@/components/ColorSchemeToggle';
import { Alert }                                            from '@/components/Alert';
import '@/styles/index.css';

export const Route = createRootRoute({
	                                     component : RootComponent,
	                                     staticData: {
		                                     header: ''
	                                     },
	                                     head      : ctx => {
		                                     return {
			                                     meta : [
				                                     {
					                                     name   : 'author',
					                                     content: 'Handy'
				                                     }
			                                     ],
			                                     links: [
				                                     {
					                                     rel : 'author',
					                                     href: 'https://github.com/handylim'
				                                     }
			                                     ]
		                                     }
	                                     }
                                     });

function RootComponent() {
	const matches = useMatches()

	return (
		<>
			<HeadContent />
			<div className='flex flex-col items-center h-screen'>
				<header className='w-full text-center p-2 md:p-5 border-b-1 border-gray-400 dark:border-gray-600 relative'>
					<h1 className='text-2xl md:text-5xl font-bold text-gray-700 dark:text-gray-200'>{ matches.at(-1)?.staticData.header }</h1>
					<ColorSchemeToggle />
				</header>

				<Alert />

				<Outlet />
				<TanStackRouterDevtools position='bottom-right' />
			</div>
		</>
	);
}