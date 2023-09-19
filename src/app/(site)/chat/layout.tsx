import { ReactNode } from 'react'

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className='grow w-full'>{children}</div>
}
