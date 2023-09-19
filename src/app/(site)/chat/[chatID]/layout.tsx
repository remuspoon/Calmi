'use client'
import { ReactNode, use, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ChatLayout({ children }: { children: ReactNode }) {
  const chatID = useParams().chatID
  const router = useRouter()
  useEffect(() => {
    if (chatID === 'anonymous?currentStep=0') {
      // create anonymous chat and redirect to it
      // router.replace('/chat/123')
    }
  }, [chatID])
  return <div className=''>{children}</div>
}
