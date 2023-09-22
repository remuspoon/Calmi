import Link from 'next/link'

export default function Home() {
  return (
    <div className='container border-slate-700 p-4 rounded-md min-h-screen flex items-center text-center justify-center flex-col'>
      <nav className='absolute top-0 w-screen flex items-center gap-2 px-10 py-3 border-b border-slate-600 shadow-md shadow-slate-800'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
          className='text-white'
        >
          <path d='M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z' />
          <path d='M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1' />
        </svg>
        <h1 className='text-2xl bg-clip-text bg-gradient-to-r from-orange-500 to-blue-400 text-transparent '>
          CBT Chat
        </h1>
        <div className='ml-auto flex gap-2 items-center'>
          <Link href={'/about'} className='btn '>
            about
          </Link>
          <Link href={'/chat/anonymous'} className='btn btn-outline btn-accent'>
            Try CBT
          </Link>
        </div>
      </nav>
      <p className='uppercase font-black leading-10 text-4xl tracking-wider bg-clip-text bg-gradient-to-r from-orange-500 to-blue-400 text-transparent '>
        Welcome to CBTChat Bot!
      </p>
      <p className='text-lg'>
        Discover the power of Cognitive Behavioral Therapy (CBT) with our
        interactive chatbot. Our CBTChat Bot is designed to guide you through
        evidence-based techniques that can help improve your mental well-being
        and promote positive change.
      </p>
      <Link href={'/chat/anonymous'} className='btn btn-accent mt-8'>
        {' '}
        Start Quick Chat
      </Link>
    </div>
  )
}
