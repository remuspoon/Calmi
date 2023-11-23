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
    <div className='w-full px-4 sm:px-0 sticky top-20 z-50 '>
      <progress
        className='block progress progress-primary bg-opacity-25 backdrop-blur-md w-full'
        value={percent}
        max='100'
      />
    </div>
  )
}

export default ChatProgress
