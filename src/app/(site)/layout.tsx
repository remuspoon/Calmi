import UserProvider from '@/components/UserProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'
import Link from 'next/link'
import ChatButton from '@/components/ChatButton'
import MyChatButton from '@/components/MyChatButton'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'react-hot-toast'
import MyAccount from '@/components/MyAccount'

const inter = Varela_Round({
  display: 'swap',
  weight: '400',
  subsets: ['vietnamese', 'latin-ext']
})

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
        <Toaster />
        <NextTopLoader />
        <UserProvider>
          <nav className='sticky z-10 backdrop-blur top-0 w-full flex items-center gap-2 px-5 py-3 print:hidden bg-primary'>
            <Link href={'/'} className='flex gap-2'>
              <h1 className='font-bold text-2xl text-[#FDFEEB]'>
                CBT CHAT BOT
              </h1>
            </Link>
            <div className='ml-auto flex gap-2 items-center'>
              <div className='hidden sm:block'>
                <MyChatButton label='My Journal' href='/myjournal' />
              </div>
              <MyChatButton />
              <MyAccount />
            </div>
          </nav>

          <main className='flex-grow mt-5'>{children}</main>
        </UserProvider>
      </body>
    </html>
  )
}
