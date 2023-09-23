import { ReactNode } from 'react'

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className='grow w-full mt-16 sm:mt-20 px-4'>{children}</div>
}
