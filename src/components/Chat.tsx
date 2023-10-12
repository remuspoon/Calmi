'use client'
import { getbotReply } from '@/lib/sendMessage'
import {
  addMessageToFirestore,
  getMessagesFromFirestore
} from '@/services/firebase/firestore'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useUser } from './UserProvider'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import html2pdf from 'html2pdf.js'
import { TERMINATING_MESSAGE } from '@/lib/constants'

const delay = (ms:number)=> new Promise(resolve => setTimeout(resolve, ms));


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
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [endChat,setEndChat] = useState(false)

  const handlePrint = () => {
    if (!ref.current) return

    const opt = {
      margin: 1,
      filename: 'chat.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(ref.current).save()
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = ()=> messagesEndRef?.current?.scrollIntoView({behavior:'smooth'})
  // initialize the chat
  useEffect(() => {
    const initializeChat = async () => {
      if (user === 'loading' || !user || !chatID) return
      const m = await getMessagesFromFirestore(user.uid, chatID)
      setMessages(m)
      const isForBot = m[m.length - 1]?.role === 'user'

      if (isForBot) {
        const reply = await getbotReply(m)

        if (!reply) return

        // Add the assistant message to the state

        setMessages((prevmsg) => [...prevmsg, reply])
        await addMessageToFirestore(user.uid, chatID, reply)
      }

      if (m.length) return
      const systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content:
          "You are a therapeutic chat bot called 'Li' with expertise in Cognitive Behavioural Therapy. Respond with empathy and give advice based on cognitive behavioural therapy. Do not respond with numerical lists or bullet points."
      }
      const welcomeMessage: ChatCompletionMessageParam = {
        role: 'assistant',
        content: `Hey ${user.displayName}! I'm Li, I am a chatbot designed to help you with your mental health problems! What's on your mind today?`
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

    scrollToBottom()
  }, [chatID, messages, user])

  if (user === 'loading' || !user || !chatID) return null

  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: ChatCompletionMessageParam = {
        role: 'user',
        content
      }

      // Add the user message to the state so we can see it immediately
      setMessages((prvMsgs) => [...prvMsgs, newMessage])

      await addMessageToFirestore(user.uid, chatID, newMessage)
      let reply = await getbotReply([...messages, newMessage])

      if (!reply) return

      // end of the chat
      if(reply[0].content.toLowerCase().includes(TERMINATING_MESSAGE.toLowerCase())){
        setEndChat(true)
      }

      // Add the assistant message to the state
      
      for (const r of reply){
        setMessages((prevmsg) => [...prevmsg, r])
        await delay(r.content.length*5)
      }
      console.log('done');
      await addMessageToFirestore(user.uid, chatID, reply)
    } catch (error) {
      console.log('Error sending message', error)
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message || isLoadingAnswer) return
    setMessage('')
    await addMessage(message)
  }

  return (
    <div className='basis-full grow  border-slate-700 border-2 p-4 rounded-md h-full relative my-5 pb-0 flex flex-col max-w-2xl'>
      <div className='grow w-full print:grow-0' ref={ref}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user'
          if (msg.role === 'system') {
            return null
          }
          if (isUser) {
            return (
              <div key={index} className='chat chat-end break-inside-avoid'>
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full'>
                    <Image
                      alt='user profile'
                      src={user.photoURL || ''}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <div className='chat-header'>
                  {user.displayName}
                  {/* <time className='text-xs opacity-50'>12:46</time> */}
                </div>
                <div className='chat-bubble'>{msg.content}</div>
                {/* <div className='chat-footer opacity-50'>Seen at 12:46</div> */}
              </div>
            )
          } else {
            return (
              <div key={index} className='chat chat-start break-inside-avoid'>
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full bg-slate-700 flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='mt-2 ml-2 text-green-500'
                    >
                      <path d='M12 8V4H8' />
                      <rect width='16' height='12' x='4' y='8' rx='2' />
                      <path d='M2 14h2' />
                      <path d='M20 14h2' />
                      <path d='M15 13v2' />
                      <path d='M9 13v2' />
                    </svg>
                  </div>
                </div>
                <div className='chat-header'>
                  CBT Bot
                  {/* <time className='text-xs opacity-50'>12:45</time> */}
                </div>
                <div className='chat-bubble'>{msg.content}</div>
                {/* <div className='chat-footer opacity-50'>Delivered</div> */}
              </div>
            )
          }
        })}
        {isLoadingAnswer && <div className='chat chat-start break-inside-avoid'>
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full bg-slate-700 flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='mt-2 ml-2 text-green-500'
                    >
                      <path d='M12 8V4H8' />
                      <rect width='16' height='12' x='4' y='8' rx='2' />
                      <path d='M2 14h2' />
                      <path d='M20 14h2' />
                      <path d='M15 13v2' />
                      <path d='M9 13v2' />
                    </svg>
                  </div>
                </div>
                <div className='chat-header'>
                  CBT Bot
                  {/* <time className='text-xs opacity-50'>12:45</time> */}
                </div>
                
                <div className='chat-bubble flex gap-2'>
                  <div className="bg-slate-600 p-2 delay-75  w-px h-px rounded-full animate-bounce"></div>
                  <div className="bg-slate-600 p-2 delay-300 w-px h-px rounded-full animate-bounce"></div>
                  <div className="bg-slate-600 p-2 delay-700  w-px h-px rounded-full animate-bounce"></div>
                </div>
                {/* <div className='chat-footer opacity-50'>Delivered</div> */}
              </div>}
        <div ref={messagesEndRef}></div>
      </div>

      <form
        className='sticky bottom-0 left-0 right-0 flex items-center px-4 py-2 justify-between bg-purple-500 bg-opacity-5 backdrop-blur-md -mx-4 print:hidden'
        onSubmit={handleSubmit}
      >
        <textarea
          // type='text'
          ref={inputRef}
          placeholder='Type here'
          className='input input-bordered input-info basis-full focus:ring-0 focus:outline-0'
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if(!inputRef?.current) return
            inputRef.current.style.height = Math.min((inputRef?.current?.scrollHeight),100) + "px";
          }}
        />
        <button className={`btn btn-primary ml-2 ${endChat && 'btn-disabled'}`} disabled={endChat}>Send</button>
        <button
          className='btn btn-secondary ml-2 btn-outline btn-sm'
          onClick={handlePrint}
        >
          print
        </button>
      </form>
    </div>
  )
}

export default Chat