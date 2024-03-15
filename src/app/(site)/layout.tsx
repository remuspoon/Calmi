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
import CalmiLogo from '../../../public/CalmiLogo.png'

const inter = Varela_Round({
  display: 'swap',
  weight: '400',
  subsets: ['vietnamese', 'latin-ext']
})

export const metadata: Metadata = {
  title: 'Calmi',
  description: 'Your pocket mental health chatbot!'
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
          <nav className='sticky z-10 backdrop-blur top-0 w-full flex items-center gap-2 px-10 py-5 print:hidden bg-secondary'>
            <Link href={'/'} className='flex items-center'>
              <h1 className='font-bold text-4xl text-[#004798] '>CALMI</h1><img src={CalmiLogo.src} alt="Logo" className='w-[3rem]'/>
            </Link>
            <div className='ml-auto flex gap-2 items-center'>
              <MyChatButton label='My Journal' href='/myjournal' />
              <div className='hidden sm:block'>
                <MyChatButton />
              </div>

              <MyAccount />
            </div>
          </nav>

          <main className='flex-grow mt-5'>{children}</main>
        </UserProvider>
      </body>
    </html>
  )
}
