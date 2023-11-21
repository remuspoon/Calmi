'use client'
import ChatCard from '@/components/ChatCard'
import { getChats } from '@/services/firebase/firestore'
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
        setChats(chats)
      } catch (error) {
        router.replace('/')
      }
    }
    f()
  }, [uid, router])

  if (!uid) return null

  return (
    <div className='flex gap-2'>
      {chats.map((c) => (
        <ChatCard chat={c} setChats={setChats} key={c.id} />
      ))}
    </div>
  )
}

export default ChatDashboard
