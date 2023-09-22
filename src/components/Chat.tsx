'use client'
import { sendMessage } from '@/lib/sendMessage'
import { addMessageToFirestore } from '@/services/firebase/firestore'
import React, { FormEvent, useEffect, useState } from 'react'
import { useUser } from './UserProvider'
import { useParams } from 'next/navigation'

export type ChatCompletionMessageParam = {
  role: 'system' | 'user' | 'assistant'
  content: string
}
function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const user = useUser()
  const chatID = useParams().chatID as string

  useEffect(() => {
    const initializeChat = async () => {
      if (!user?.uid || !chatID) return
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

      await addMessageToFirestore(user.uid, chatID, [
        systemMessage,
        welcomeMessage
      ])
    }

    // When no messages are present, we initialize the chat the system message and the welcome message
    // We hide the system message from the user in the UI
    if (!messages?.length) {
      initializeChat()
    }
  }, [chatID, messages, user?.uid])

  if (!user?.uid || !chatID) return null

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
      await addMessageToFirestore(user.uid, chatID, [newMessage, reply])
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
    setMessage('')
    await addMessage(message)
  }
  return (
    <div className='basis-full grow  border-slate-700 border-2 p-4 rounded-md h-full relative my-5 pb-0 flex flex-col'>
      <div className='grow'>
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
      </div>

      <form
        className='sticky bottom-0 left-0 right-0 flex items-center px-4 py-2 justify-between bg-purple-500 bg-opacity-5 backdrop-blur-md -mx-4'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          placeholder='Type here'
          className='input input-bordered input-info basis-full focus:ring-0 focus:outline-0'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='btn btn-primary ml-2'>Send</button>
      </form>
    </div>
  )
}

export default Chat
