import Link from 'next/link'

export default function Home() {
  return (
    <div className='container border-slate-700 p-4 rounded-md min-h-screen flex items-center text-center justify-center flex-col'>
      <h1 className='text-2xl'>CBT Chat</h1>
      <p className='uppercase font-black leading-10 text-4xl tracking-wider bg-clip-text bg-gradient-to-r from-orange-500 to-blue-400 text-transparent '>
        an awesome freaking landing page
      </p>
      <Link href={'/chat/anonymous'} className='btn btn-accent mt-8'>
        {' '}
        Start Anonymous Chat
      </Link>
    </div>
  )
}
