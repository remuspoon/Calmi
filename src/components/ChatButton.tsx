'use client'

import { useRouter } from 'next/navigation'
import { useUser } from './UserProvider'
import { SigninWithGoogle } from '@/services/firebase/auth'

function ChatButton({ label }: { label: string }) {
  const router = useRouter()
  const user = useUser()
  const handleClick = async () => {
    if (!user) {
      const newuser = await SigninWithGoogle()

      router.push(`/chat/${newuser.uid}`)
    }
  }
  return (
    <button className='btn btn-accent btn-outline' onClick={handleClick}>
      {label}
    </button>
  )
}

export default ChatButton
