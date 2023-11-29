'use client'

import { useRouter } from 'next/navigation'
import { useUser } from './UserProvider'
import { SigninWithGoogle } from '@/services/firebase/auth'
import { createChat } from '@/services/firebase/firestore'
import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { editAccountModalAtom } from '@/lib/state'

function ChatButton({ label }: { label: string }) {
  const router = useRouter()
  let user = useUser()
  const [disabled, setDisabled] = useState(false)
  const seteditAccountModal = useSetAtom(editAccountModalAtom)
  const topNavLabel = user ? 'New Chat' : 'Sign in to chat'
  const handleClick = async () => {
    setDisabled(true)
    if (!user || user === 'loading') {
      const res = await SigninWithGoogle()
      user = res.user

      if (res.isNewUser) {
        seteditAccountModal(true)
        return
      }
    }
    const chat = await createChat(user.uid)
    router.push(`/chat/${chat.id}`)
  }
  return (
    <button
      className='btn btn-primary btn-sm sm:btn-md sm:w-40 w-36 text-white font-bold'
      onClick={handleClick}
      disabled={disabled}
    >
      {label === 'topNav' ? topNavLabel : label}
    </button>
  )
}

export default ChatButton
