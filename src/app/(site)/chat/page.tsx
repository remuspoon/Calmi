'use client'
import {
  deleteChatFromFirestore,
  getChats
} from '@/services/firebase/firestore'
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
        setChats(chats)
      } catch (error) {
        router.replace('/')
      }
    }
    f()
  }, [uid, router])

  if (!uid) return null

  const handleDeleteChat = async (id: string) => {
    try {
      await deleteChatFromFirestore(uid, id)
      setChats((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {}
  }
  return (
    <div className='flex flex-col gap-2'>
      {chats.map((c) => (
        <div className='flex gap-2' key={c.id}>
          <Link
            href={`/chat/${c.id}?currentStep=1`}
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
          <button
            className='hover:text-red-400'
            onClick={() => handleDeleteChat(c.id)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M3 6h18' />
              <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
              <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
              <line x1='10' x2='10' y1='11' y2='17' />
              <line x1='14' x2='14' y1='11' y2='17' />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export default ChatDashboard
