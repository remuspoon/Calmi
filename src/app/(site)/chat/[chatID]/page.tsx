'use client'

import { sendMessage } from '@/lib/sendMessage'
import { FormEvent, useEffect, useState } from 'react'

export type ChatCompletionMessageParam = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function ChatPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)

  useEffect(() => {
    const initializeChat = () => {
      const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content:
          "You are a therapeutic chat bot called 'Ms. Li' with expertise in Cognitive Behavioural Therapy. Respond with empathy and give advice based on cognitive behavioural therapy. Do not respond with numerical lists or bullet points."
      }
      const welcomeMessage: ChatCompletionMessageParam = {
        role: 'assistant',
        content:
          "Hello there! I'm Li, I am here to help you deal with your negative feelings! On a scale of 1-10 (1 being the worst you've ever felt and 10 being the best you've ever felt), how are you feeling right now?"
      }
      setMessages([systemMessage, welcomeMessage])
    }

    // When no messages are present, we initialize the chat the system message and the welcome message
    // We hide the system message from the user in the UI
    if (!messages?.length) {
      initializeChat()
    }
  }, [messages])

  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: ChatCompletionMessageParam = {
        role: 'user',
        content
      }

      // Add the user message to the state so we can see it immediately
      setMessages((prvMsgs) => [...prvMsgs, newMessage])

      const reply = await sendMessage([...messages, newMessage])

      if (!reply) return

      // Add the assistant message to the state
      setMessages((prevmsg) => [...prevmsg, reply])
    } catch (error) {
      // Show error when something goes wrong
      // addToast({ title: 'An error occurred', type: 'error' })
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (isLoadingAnswer) return
    e.preventDefault()
    await addMessage(message)
    setMessage('')
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='max-w-4xl w-screen border-slate-700 border-2 p-4 rounded-md h-full relative'>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user'
          if (msg.role === 'system') {
            return null
          }

          if (isUser) {
            return (
              <div key={index} className='chat chat-end'>
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full'>
                    <img src='/images/stock/photo-1534528741775-53994a69daeb.jpg' />
                  </div>
                </div>
                <div className='chat-header'>
                  Anakin
                  <time className='text-xs opacity-50'>12:46</time>
                </div>
                <div className='chat-bubble'>{msg.content}</div>
                <div className='chat-footer opacity-50'>Seen at 12:46</div>
              </div>
            )
          } else {
            // console.log(msg)
            return (
              <div key={index} className='chat chat-start'>
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full'>
                    <img src='/images/stock/photo-1534528741775-53994a69daeb.jpg' />
                  </div>
                </div>
                <div className='chat-header'>
                  Obi-Wan Kenobi
                  <time className='text-xs opacity-50'>12:45</time>
                </div>
                <div className='chat-bubble'>{msg.content}</div>
                <div className='chat-footer opacity-50'>Delivered</div>
              </div>
            )
          }
        })}

        <form
          className='absolute bottom-0 left-0 right-0 flex items-center p-4 justify-between'
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            placeholder='Type here'
            className='input input-bordered input-info basis-full mt-auto focus:ring-0 focus:outline-0'
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
