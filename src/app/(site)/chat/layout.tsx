import { ReactNode } from 'react'

export default function ChatLayout({ children }: { children: ReactNode }) {
  return <div className='px-4'>{children}</div>
}
