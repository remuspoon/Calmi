'use client'

import { useRouter } from 'next/navigation'
import { useUser } from './UserProvider'
import { SigninWithGoogle } from '@/services/firebase/auth'
import { createChat } from '@/services/firebase/firestore'

function ChatButton({ label }: { label: string }) {
  const router = useRouter()
  let user = useUser()
  const handleClick = async () => {
    if (!user) {
      user = await SigninWithGoogle()
    }
    const chatId = createChat(user.uid).id
    router.push(`/chat/${chatId}`)
  }
  return (
    <button className='btn btn-accent btn-outline' onClick={handleClick}>
      {label}
    </button>
  )
}

export default ChatButton
