import React                            from 'react';
import ReactDOM                         from 'react-dom/client';
import { Provider }                     from 'react-redux';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { store }                        from '@/store';
import { routeTree }                    from '@/routeTree.gen';

const router = createRouter({
	                            routeTree,
	                            defaultPreload: 'intent'
                            })

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}

	interface StaticDataRouteOption {
		header: string
	}
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<React.StrictMode>
			<Provider store={ store }>
				<RouterProvider router={ router } />
			</Provider>
		</React.StrictMode>
	);
}