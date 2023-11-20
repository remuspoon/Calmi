'use client'

import { updateChatSession } from '@/services/firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { useUser } from './UserProvider'

function TimeTracker({ chatId }: { chatId: string }) {
  const time = useRef(0)
  const user = useUser()
  useEffect(() => {
    if (!user || user === 'loading') return
    const interval = setInterval(() => {
      time.current += 1
    }, 1000)
    return () => {
      clearInterval(interval)
      updateChatSession(user.uid, chatId, time.current)
    }
  }, [user, chatId])
  return null
}

export default TimeTracker
