'use client'

import { deleteChatFromFirestore } from '@/services/firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import { useUser } from './UserProvider'
import { useState } from 'react'

const customButton =
  'border border-primary rounded px-4 bg-secondary hover:bg-primary hover:text-secondary font-semibold'

function ChatCard({ chat, setChats }: { chat: any; setChats?: any }) {
  const user = useUser()
  const [expanded, setExpanded] = useState(false)
  if (!user) return null
  if (user === 'loading') return null
  const uid = user?.uid
  const handleDeleteChat = async (id: string) => {
    try {
      await deleteChatFromFirestore(uid, id)
      setChats((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {}
  }

  return (
    <div className='grid grid-cols-1 gap-2 bg-secondary rounded-md px-6 p-2 basis-96 relative mx-auto shrink-0 max-w-2xl border border-black'>
      <h1 className='font-semibold mr-4'>
        {new Timestamp(chat.timeStamp.seconds, chat.timeStamp.nanoseconds)
          .toDate()
          .toLocaleString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
      </h1>
      {!chat.completed && <p>In Progress</p>}
      {chat.reframedThoughts && (
        <>
          <p
            className={`font-semibold text-xl ${
              !expanded ? 'line-clamp-2' : ''
            }`}
          >
            {chat.reframedThoughts}
          </p>
          <p className='mt-2'>Automatic Thoughts:</p>
          <p className={!expanded ? 'line-clamp-2' : ''}>
            {chat.distortedThoughts}
          </p>
        </>
      )}
      {chat.summary && (
        <>
          <p className='mt-2'>Summary:</p>
          <p className={!expanded ? 'line-clamp-2' : ''}>{chat.summary}</p>
        </>
      )}
      {chat.completed && !expanded && (
        <button
          className='btn btn-primary btn-sm absolute bottom-2 right-2 shadow-md shadow-primary'
          onClick={() => setExpanded(true)}
        >
          <span className='text-sm text-white'>View More</span>
        </button>
      )}

      {setChats && (
        <button
          className='hover:text-red-400 absolute top-2 right-2'
          onClick={() => handleDeleteChat(chat.id)}
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
      )}

      {((expanded && chat.completed) || !chat.completed) && (
        <div className='flex gap-2 justify-center'>
          <Link
            href={`/chat/${chat.id}?currentStep=1`}
            className={customButton}
          >
            View chat
          </Link>
          {chat.summary && (
            <button className={customButton} onClick={() => setExpanded(false)}>
              <span className='text-white'>View Less</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatCard
