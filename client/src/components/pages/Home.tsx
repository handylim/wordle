import { Link } from '@/components/Link';

export const HomeComponent = () => {
	return (
		<main className='flex flex-col sm:flex-row items-center justify-center-safe gap-10 md:gap-20 grow w-full'>
			<Link to='/single-player' className='btn btn-primary text-xl md:text-3xl rounded-sm md:rounded-lg px-7 md:px-14 py-3 md:py-6'>
				Single Player
			</Link>

			<Link to='/multi-player' className='btn btn-primary text-xl md:text-3xl rounded-sm md:rounded-lg px-7 md:px-14 py-3 md:py-6'>
				Multi Player
			</Link>
		</main>
	)
}