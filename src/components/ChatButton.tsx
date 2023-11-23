'use client'

import { useRouter } from 'next/navigation'
import { useUser } from './UserProvider'
import { SigninWithGoogle } from '@/services/firebase/auth'
import { createChat } from '@/services/firebase/firestore'
import { useState } from 'react'

function ChatButton({ label }: { label: string }) {
  const router = useRouter()
  let user = useUser()
  const [disabled, setDisabled] = useState(false)
  const topNavLabel = user ? 'New Chat' : 'Sign in to chat'
  const handleClick = async () => {
    setDisabled(true)
    if (!user || user === 'loading') {
      user = await SigninWithGoogle()
    }
    const chat = await createChat(user.uid)
    router.push(`/chat/${chat.id}`)
  }
  return (
    <button
      className='btn btn-primary btn-sm sm:btn-md w-40 text-white font-bold'
      onClick={handleClick}
      disabled={disabled}
    >
      {label === 'topNav' ? topNavLabel : label}
    </button>
  )
}

export default ChatButton
