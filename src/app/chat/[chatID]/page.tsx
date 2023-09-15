'use client'

import { FormEvent, useState } from 'react'

function ChatPage() {
  const [message, setMessage] = useState('')
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submit', message)
    setMessage('')
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-96 border-slate-700 border-2 p-4 rounded-md h-screen relative'>
        <div className='chat chat-start'>
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <img src='/images/stock/photo-1534528741775-53994a69daeb.jpg' />
            </div>
          </div>
          <div className='chat-header'>
            Obi-Wan Kenobi
            <time className='text-xs opacity-50'>12:45</time>
          </div>
          <div className='chat-bubble'>You were the Chosen One!</div>
          <div className='chat-footer opacity-50'>Delivered</div>
        </div>
        <div className='chat chat-end'>
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <img src='/images/stock/photo-1534528741775-53994a69daeb.jpg' />
            </div>
          </div>
          <div className='chat-header'>
            Anakin
            <time className='text-xs opacity-50'>12:46</time>
          </div>
          <div className='chat-bubble'>I hate you!</div>
          <div className='chat-footer opacity-50'>Seen at 12:46</div>
        </div>
        <form
          className='absolute bottom-0 left-0 right-0 flex items-center p-4'
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            placeholder='Type here'
            className='input input-bordered input-info w-full max-w-sm mt-auto focus:ring-0 focus:outline-0'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className='btn btn-primary ml-2'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default ChatPage
