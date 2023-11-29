'use client'
import { getbotReply, postprocess } from '@/lib/chatFunctions'
import {
  addMessageToFirestore,
  getMessagesFromFirestore,
  getUser
} from '@/services/firebase/firestore'
import React, {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { useUser } from './UserProvider'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import html2pdf from 'html2pdf.js'
import { TERMINATING_MESSAGE } from '@/lib/constants'
import { ChatCompletionMessageParam } from '@/services/openai/chat'
import { toast } from 'react-hot-toast'
import { chat_closed, chat_opened } from '@/services/firebase/analytics'
import { chatProgressAtom } from '@/lib/state'
import { useSetAtom } from 'jotai'
import { delay } from '@/lib/utils'

function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<
    ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]
  >([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const user = useUser()
  const chatID = useParams().chatID as string
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [endChat, setEndChat] = useState(false)
  const setProgress = useSetAtom(chatProgressAtom)

  // print
  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = () => {
    if (!printRef.current) return

    const opt = {
      margin: 1,
      filename: 'chat.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(printRef.current).save()
  }

  // scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () =>
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })

  useLayoutEffect(() => {
    scrollToBottom()
  }, [messages])

  // initialize the chat
  useEffect(() => {
    const initializeChat = async () => {
      if (user === 'loading' || !user || !chatID) return
      const m = await getMessagesFromFirestore(user.uid, chatID)
      setMessages(m)
      const lastMessage = m[m.length - 1]
      const isForBot = lastMessage?.role === 'user'
      const lastUserMessage = m.filter((m) => m.role === 'user').reverse()[0]
      if (lastMessage) {
        setProgress({
          token: lastMessage.token!,
          subtoken: lastMessage.subtoken!
        })
      }

      if (isForBot) {
        const reply = await getbotReply(m)
        if (!reply) return

        // Add the assistant message to the state

        setMessages((prevmsg) => [...prevmsg, ...reply])
        await addMessageToFirestore(user.uid, chatID, reply)
      }

      if (
        lastMessage?.content.toLowerCase() == TERMINATING_MESSAGE.toLowerCase()
      ) {
        setEndChat(true)
        setProgress({
          token: 'END',
          subtoken: 0
        })
        return
      }

      if (m.length) return
      let userName = (await getUser(user.uid)) as any
      userName = userName?.displayName

      if (!userName) userName = user.displayName ?? 'User'

      const systemMessage: ChatCompletionMessageParam<'system'> = {
        role: 'system',
        content:
          'You are a therapeutic chat bot called Calmi with expertise in Cognitive Behavioural Therapy. Respond with empathy and give advice based on cognitive behavioural therapy. Do not respond with numerical lists or bullet points.'
      }
      const welcomeMessage: ChatCompletionMessageParam<'assistant'> = {
        role: 'assistant',
        content: `Hey ${userName}! I'm Calmi, I am a Cognitive Behavourial Therapy (CBT) chatbot designed to help you with your mental health problems! What's on your mind today?`
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

    chat_opened(chatID)

    return () => {
      chat_closed(chatID),
        setProgress({
          token: 'START',
          subtoken: 0
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatID, user])

  if (user === 'loading' || !user || !chatID) return null

  // add message to firestore and get reply from bot
  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      // const lastUserMessage = messages[messages.length - 1]
      // console.log(lastUserMessage)
      const token = messages[messages.length - 1]?.token ?? 'START'
      const subtoken = messages[messages.length - 1]?.subtoken ?? 0

      const newMessage: ChatCompletionMessageParam<'user'> = {
        role: 'user',
        content,
        token,
        subtoken
      }

      // Add the user message to the state so we can see it immediately
      setMessages((prvMsgs) => [...prvMsgs, newMessage])

      await addMessageToFirestore(user.uid, chatID, newMessage)
      let reply = await getbotReply([...messages, newMessage])
      if (!reply) return

      // end of the chat
      if (reply.find((r) => r.content === TERMINATING_MESSAGE) !== undefined) {
        setEndChat(true)
        setProgress({
          token: 'END',
          subtoken: 0
        })
        postprocess(user.uid, chatID, newMessage, true, messages)
      }

      // Add the assistant message to the state
      for (const r of reply) {
        setMessages((prevmsg) => [...prevmsg, r])
        await delay(r.content.length * 5)
      }

      // save to firestore
      await addMessageToFirestore(user.uid, chatID, reply)

      setProgress({
        token,
        subtoken
      })

      postprocess(user.uid, chatID, newMessage)
    } catch (error) {
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  // handle submit
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (!message || isLoadingAnswer) return
    if (message.length > 2000) {
      toast.error('Message too long')
      return
    }
    setMessage('')
    await addMessage(message)
  }

  return (
    <div className='basis-full grow mt-5 rounded-md h-full relative my-5 pb-0 flex flex-col max-w-2xl p-4 bg-secondary'>
      <div className='grow w-full print:grow-0' ref={printRef}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user'
          if (msg.role === 'system' || msg.content === TERMINATING_MESSAGE) {
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
                {/* <div className='chat-header'>
                  {user.displayName}
                  <time className='text-xs opacity-50'>12:46</time>
                </div> */}
                <div className='chat-bubble bg-primary text-white'>
                  {msg.content}
                </div>
                {/* <div className='chat-footer opacity-50'>Seen at 12:46</div> */}
              </div>
            )
          } else {
            return (
              <div key={index} className='chat chat-start break-inside-avoid'>
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full bg-slate-700 flex'>
                    <Image
                      src={'/icon.png'}
                      width={20}
                      height={20}
                      className='bg-primary'
                      alt='bot icon'
                    />
                  </div>
                </div>
                {/* <div className='chat-header'>
                  CBT Bot
                  <time className='text-xs opacity-50'>12:45</time>
                </div> */}
                <div className='chat-bubble bg-info text-black'>
                  {msg.content}
                </div>
                {/* <div className='chat-footer opacity-50'>Delivered</div> */}
              </div>
            )
          }
        })}
        {isLoadingAnswer && (
          <div className='chat chat-start break-inside-avoid'>
            <div className='chat-image avatar'>
              <div className='w-10 rounded-full bg-slate-700 flex'>
                <Image
                  src={'/icon.png'}
                  width={20}
                  height={20}
                  className='bg-primary'
                  alt='bot icon'
                />
              </div>
            </div>
            {/* <div className='chat-header'>
              CBT Bot
              <time className='text-xs opacity-50'>12:45</time>
            </div> */}

            <div className='chat-bubble bg-info text-primary flex gap-2'>
              <div className='bg-[#96968B] p-2 delay-75  w-px h-px rounded-full animate-bounce'></div>
              <div className='bg-[#96968B] p-2 delay-300 w-px h-px rounded-full animate-bounce'></div>
              <div className='bg-[#96968B] p-2 delay-700  w-px h-px rounded-full animate-bounce'></div>
            </div>
            {/* <div className='chat-footer opacity-50'>Delivered</div> */}
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <form
        className='sticky bottom-0 left-0 right-0 flex items-center px-4 py-2 justify-between bg-purple-500 bg-opacity-5 backdrop-blur-md -mx-4 print:hidden'
        onSubmit={handleSubmit}
      >
        <textarea
          // type='text'
          disabled={endChat}
          ref={inputRef}
          placeholder='Type here'
          className='input input-bordered input-info basis-full focus:ring-0 focus:outline-0 placeholder-slate-100 resize-none'
          value={message}
          onKeyDownCapture={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!inputRef?.current) return
              inputRef.current.style.height = 46 + 'px'
              handleSubmit()
            } else if (e.key === 'Enter' && e.shiftKey) {
              // console.log('shift enter')
              // setMessage((prev) => prev + '\n')
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value)
            if (!inputRef?.current) return
            inputRef.current.style.height =
              Math.min(
                Math.max(inputRef?.current?.scrollHeight, 46),
                100,
                e.target.value.length * 3 + 46
              ) + 'px'
          }}
        />
        <button
          className={`btn btn-primary ml-2 ${endChat && 'btn-disabled'}`}
          disabled={endChat}
        >
          Send
        </button>
        <button className='btn ml-2 btn-outline btn-sm' onClick={handlePrint}>
          print
        </button>
      </form>
    </div>
  )
}

export default Chat
