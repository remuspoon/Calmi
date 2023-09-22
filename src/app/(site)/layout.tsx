import UserProvider from '@/components/UserProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import ChatButton from '@/components/ChatButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CBT Chat',
  description: 'Chat with your ai bot when you are feeling down'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={
          inter.className +
          ' flex flex-col justify-center items-center min-h-screen'
        }
      >
        <UserProvider>
          <nav className='absolute top-0 w-screen flex items-center gap-2 px-10 py-3 border-b border-slate-600 shadow-md shadow-slate-800'>
            <Link href={'/'} className='flex gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-white'
              >
                <path d='M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z' />
                <path d='M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1' />
              </svg>
              <h1 className='font-bold bg-clip-text bg-gradient-to-r from-orange-500 to-blue-400 text-transparent '>
                CBT Chat
              </h1>
            </Link>
            <div className='ml-auto flex gap-2 items-center'>
              <Link href={'/about'} className='btn btn-sm'>
                about
              </Link>
              <ChatButton label='Try CBT' />
            </div>
          </nav>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
