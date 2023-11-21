'use client'

import { calculateChatProgress } from '@/lib/constants'
import { chatProgressAtom } from '@/lib/state'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

function ChatProgress() {
  const chatProgress = useAtomValue(chatProgressAtom)
  const [percent, setPercent] = useState(0)
  useEffect(() => {
    const r = calculateChatProgress(chatProgress.token as any)

    if (r) {
      setPercent(r)
    }
  }, [chatProgress])
  return (
    <>
      <progress
        className='progress progress-primary w-full sticky top-20 z-50 bg-opacity-25 backdrop-blur-md'
        value={percent}
        max='100'
      />
    </>
  )
}

export default ChatProgress
