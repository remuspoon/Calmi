'use client'
import { getChats } from '@/services/firebase/firestore'
import { Timestamp } from 'firebase/firestore'
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
    <div className='flex flex-col gap-2'>
      {chats.map((c) => (
        <Link
          href={`/chat/${c.id}?currentStep=1`}
          key={c.id}
          className='rounded-md px-6 p-2 border-slate-700 border-2'
        >
          {new Timestamp(c.timeStamp.seconds, c.timeStamp.nanoseconds)
            .toDate()
            .toLocaleString(undefined, {
              // weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
        </Link>
      ))}
    </div>
  )
}

export default ChatDashboard
