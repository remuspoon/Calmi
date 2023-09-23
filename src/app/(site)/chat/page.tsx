'use client'
import { getChats } from '@/services/firebase/firestore'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function ChatDashboard() {
  const uid = useSearchParams().get('uid')
  const router = useRouter()
  const [chats, setChats] = React.useState<any[]>([])
  useEffect(() => {
    if (!uid) {
      router.replace('/')
      return
    }

    const f = async () => {
      try {
        const chats = await getChats(uid)
        console.log(chats)
        setChats(chats)
      } catch (error) {
        console.log(error)
        router.replace('/')
      }
    }
    f()
  }, [uid, router])
  return (
    <div>
      {chats.map((c) => (
        <Link href={`/chat/${c.id}?currentStep=1`} key={c.id}>
          {c.id!}
        </Link>
      ))}
    </div>
  )
}

export default ChatDashboard
