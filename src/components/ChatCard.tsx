'use client'

import {
  deleteChatFromFirestore,
  updateChat
} from '@/services/firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import { useUser } from './UserProvider'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

const viewMoreLessBtn =
  'border border-primary rounded px-4 bg-secondary hover:bg-primary hover:text-secondary font-semibold'

function ChatCard({
  chat,
  setChats,
  page = 'journal'
}: {
  chat: any
  setChats?: any
  page?: 'journal' | 'history'
}) {
  const user = useUser()
  const [expanded, setExpanded] = useState(false)
  const [editable, setEditable] = useState(false)
  const reframeRef = useRef<HTMLParagraphElement>(null)
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
    <div className='grid grid-cols-1 gap-2 bg-secondary rounded-md px-6 p-2 basis-96 relative mx-auto shrink-0 max-w-2xl w-full border border-black py-9'>
      <h1 className='font-semibold mr-4 hover:underline'><a href={`/chat/${chat.id}?currentStep=1`}>
        {new Timestamp(chat.timeStamp.seconds, chat.timeStamp.nanoseconds)
          .toDate()
          .toLocaleString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
          </a>
      </h1>
      <p>
        {!chat.completed && page === 'history'
          ? 'In Progress'
          : chat.completed && page === 'history'
          ? 'Complete'
          : ''}
      </p>
      {!(page === 'history') && chat.reframedThoughts && (
        <>
          <div className='group relative'>
            <p
              ref={reframeRef}
              className={`font-semibold text-xl ${
                !expanded ? 'line-clamp-2' : ''
              }`}
              contentEditable={editable}
              // after the user is done editing the text, update the chat in firestore
              onBlur={async (e) => {
                updateChat(uid, chat.id, {
                  reframedThoughts: e.currentTarget.innerText
                })
                toast.success('Saved!')
                setEditable(false)
              }}
              suppressContentEditableWarning={true}
            >
              {chat.reframedThoughts}
            </p>
            <button
              onClick={
                // if the user is not editing the text, allow them to edit it
                (e) => {
                  setEditable((p) => !p)
                  e.stopPropagation()
                  setTimeout(() => {
                    reframeRef.current?.focus()
                  }, 100)
                }
              }
              className={`absolute top-0 right-0 ${editable ? 'hidden' : ''}`}
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
                className='border border-primary rounded-full p-1 absolute top-0 right-0 text-primary group-hover:text-secondary group-hover:bg-primary opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100  transition-all duration-300'
              >
                <path d='M12 20h9' />
                <path d='M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' />
                <path d='m15 5 3 3' />
              </svg>
            </button>
          </div>

          <p className='mt-2'>Automatic Thoughts:</p>
          <p className={!expanded ? 'line-clamp-2' : ''}>
            {chat.distortedThoughts}
          </p>
        </>
      )}
      {!(page === 'history') && chat.summary && (
        <>
          <p className='mt-2'>Summary:</p>
          <p className={!expanded ? 'line-clamp-2' : ''}>{chat.summary}</p>
        </>
      )}
      {chat.completed && !(page === 'history') && (
        <button
          className={
            'absolute bottom-2 right-2 ' + viewMoreLessBtn
          }
          onClick={() => setExpanded((p) => !p)}
        >
          {!expanded ? 'View More' : 'View Less'}
        </button>
      )}

      {/* delete button */}

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

      {/* View Chat button */}

      <div className='flex gap-2 justify-center'>
        <Link href={`/chat/${chat.id}?currentStep=1`} className={`${!expanded ? "hidden" : "border border-primary rounded px-4 bg-secondary hover:bg-primary hover:text-secondary font-semibold"} `} >
          View chat
        </Link>
      </div>
    </div>
  )
}

export default ChatCard
