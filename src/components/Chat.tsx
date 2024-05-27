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
  // FIXME: Set some state for concatenated string
  const [message, setMessage] = useState('')
  const [currentMessages, setCurrentMessages] = useState<string[]>([])
  const [messages, setMessages] = useState<
    ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]
  >([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const [timer, setTimer] = useState(0);

  const user = useUser()
  const chatID = useParams().chatID as string
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [endChat, setEndChat] = useState(false)
  const setProgress = useSetAtom(chatProgressAtom)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // merk code begins here
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSubmitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [shouldSendMessages, setShouldSendMessages] = useState(false);

  
// Improved handling of input change to reset and handle timers correctly
const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setMessage(e.target.value);
  // Reset typing timer on every key press
  if (typingTimerRef.current) {
    clearTimeout(typingTimerRef.current);
  }
  typingTimerRef.current = setTimeout(() => {
    console.log("User paused typing");


    (async function() {
      try {
          await addMessage(`t`)
      } catch (e) {
          console.error(e);
      }
  })();


    typingTimerRef.current = null;
    attemptToSendMessages()
}, 4500);
};

// Updated submit handler to manage message accumulation properly
const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
  e?.preventDefault();
  if (isLoadingAnswer) return; // Check if still waiting for an answer to avoid duplication

  if (message.trim().length <= 0) return;

  const persist_message = message.trim()
  setMessage(''); // Clear input field
  await addMessage(persist_message);


  setCurrentMessages(prev => [...prev, persist_message]);

  // Set a timeout to check if the user has stopped submitting messages
  if (handleSubmitTimerRef.current) {
    clearTimeout(handleSubmitTimerRef.current);
  }
  handleSubmitTimerRef.current = setTimeout(() => {
    console.log("Submission pause complete");

    (async function() {
      try {
          await addMessage(`s`)
      } catch (e) {
          console.error(e);
      }
  })();


    handleSubmitTimerRef.current = null;
    attemptToSendMessages()
}, 3000);
  
};

// // Ensure messages are sent only when all conditions are met
// const attemptToSendMessages = async () => {
//   console.log("Attempted to send messages")
//   console.warn("weewoo")
  
//   await addMessage(`debug attempting send: ${currentMessages.length} ${typingTimerRef.current} ${handleSubmitTimerRef.current} hehe`)

//   if (!currentMessages.length) return; // || typingTimerRef.current || handleSubmitTimerRef.current) return;


//   const combinedMessages = currentMessages.join("\n");
//   botReply(combinedMessages);
//   setCurrentMessages([]); // Clear accumulated messages after sending
// };

const attemptToSendMessages = async () => {
  // await addMessage(`debug attempting send: ${currentMessages.length} ${typingTimerRef.current} ${handleSubmitTimerRef.current}`)
  (async function() {
    try {
        await addMessage(`as`)
    } catch (e) {
        console.error(e);
    }
})();

  // Check if it's appropriate to attempt to send messages
  if (!typingTimerRef.current && !handleSubmitTimerRef.current && currentMessages.length > 0) {
    (async function() {
      try {
          await addMessage(`sst`)
      } catch (e) {
          console.error(e);
      }
  })();
      setShouldSendMessages(true);  // Set flag to true to trigger sending in effect
  }
};

useEffect(() => {
  (async function() {
    try {
        await addMessage(`sss`)
    } catch (e) {
        console.error(e);
    }
})();
  // if (!typingTimerRef.current && !handleSubmitTimerRef.current && currentMessages.length > 0) {
    if (!shouldSendMessages) return;

    const combinedMessages = currentMessages.join("\n");
    botReply(combinedMessages);  // Send combined messages to the bot
    console.log("Messages sent due to inactivity after submission:", combinedMessages);
    setCurrentMessages([]); // Clear accumulated messages after sending
    setShouldSendMessages(false)
}, [shouldSendMessages]);

// useEffect(() => {
//   (async function() {
//     try {
//         await addMessage(`currentMessages updated to length ${currentMessages.length}`)
//     } catch (e) {
//         console.error(e);
//     }
// })();
// }, [currentMessages])
  // merk end


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

  // // Initalize the timer
  // useEffect(() => {
  //   // increment the timer
  //   const timerCallback = setTimeout(() => {
  //       // FIXME: Use set state
  //       setTimer((timer) => timer + 1);
  //       setCurrentMessages([]);
  //       setTimer(0);
  //     }, 3000);
  //     return () => {
  //       clearInterval(timerCallback);
  //     };
  // }, [currentMessages]);

  // useEffect(() => {
  //   if (timer >= 3 && !message && currentMessages.length) {
  //     const combinedMessage = currentMessages.join("\n\n"); // combine the messages into a single message for the bot
  //     botReply(combinedMessage);
  //     console.log("API Request sent with:", combinedMessage);
  //     setTimer(0);
  //     setCurrentMessages([]);
  //   }
  //   console.log(timer);
  // }, [timer]);



  // initialize the chat
  useEffect(() => {
    const initializeChat = async () => {
      if (user === 'loading' || !user || !chatID) return
      const m = await getMessagesFromFirestore(user.uid, chatID)
      setMessages(m)
      console.log(m)
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
        content: `Hey ${userName}! I'm Calmi, I'm here to help you with your mental health. Take a second to think about what is or has been upsetting you, and when you're ready you can tell me all about it. I'm here for you and lets work through this together :)`
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

  // end of useeffect

  if (user === 'loading' || !user || !chatID) return null


  // add message to firestore
  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      // const lastUserMessage = messages[messages.length - 1]
      // console.log(lastUserMessage)

      // Func 1
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

    } catch (error) {
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  // get reply from bot
  const botReply = async (content: string) => {
    const token = messages[messages.length - 1]?.token ?? 'START'
    const subtoken = messages[messages.length - 1]?.subtoken ?? 0
    const newMessage: ChatCompletionMessageParam<'user'> = {
      role: 'user',
      content,
      token,
      subtoken
    }

    // newMessage = currentMessages.join("") (psudo)
    // currentMessages as a variable
    try {
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

  // // handle submit
  // const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
  //   e?.preventDefault()
  //   if (!message || isLoadingAnswer) return
  //   if (message.length > 2000) {
  //     toast.error('Message too long')
  //     return

  // }
  //   // lets set a timer for 1-2 seconds, if message is updated during that time
  //   // then, do not runBotReply function yet
  //   // append the next message to the last one to be one big gulp
  //   // const timer = new Promise<void>((resolve) => {
  //   //   setTimeout(resolve, 2000);
  //   // });
  //   // const originalMessage = message;
  //   // await timer;
    
  //   setMessage('')
  //   setCurrentMessages([...currentMessages, message])
  //   // if (message !== originalMessage) return;
  //   // setTimer(0);

  //   // Add to firestore
  //   // botReply(message)
  //   await addMessage(message)
    
  // }


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
        {/* <button className='btn ml-2 btn-outline btn-sm' onClick={handlePrint}>
          print
        </button> */}
      </form>
    </div>
  )
}

export default Chat
