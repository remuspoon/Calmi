'use client'

import { chatProgressAtom } from '@/lib/state'
import { useAtomValue } from 'jotai'

function ChatProgress() {
  const chatProgress = useAtomValue(chatProgressAtom)
  return (
    <div className='sticky top-20 z-50 bg-opacity-25 backdrop-blur-md'>
      <p>Current Stage: {chatProgress.token} </p>
      <progress
        className='progress progress-info w-full '
        value={50}
        max='100'
      />
    </div>
  )
}

export default ChatProgress
