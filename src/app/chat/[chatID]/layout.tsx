'use client'
import { ReactNode, use, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ChatLayout({ children }: { children: ReactNode }) {
  const chatID = useParams().chatID
  useEffect(() => {
    if (chatID === 'anonymous') {
      // create anonymous chat and redirect to it
    }
  }, [chatID])
  return <div>{children}</div>
}
