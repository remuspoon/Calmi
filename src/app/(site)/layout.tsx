import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
          inter.className + ' flex flex-col justify-center items-center'
        }
      >
        {children}
      </body>
    </html>
  )
}
