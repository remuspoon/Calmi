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
import { send } from 'process'
import { set } from 'nprogress'

function Chat() {
  const [message, setMessage] = useState('')
  const messageRef = useRef('')
  const [messages, setMessages] = useState<
    ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]
  >([])
  const messagesRef = useRef<ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const user = useUser()
  const chatID = useParams().chatID as string
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [endChat, setEndChat] = useState(false)
  const setProgress = useSetAtom(chatProgressAtom)
  const [currentMessages, setCurrentMessages] = useState<string[]>([])
  const currentMessagesRef = useRef<string[]>([])
  const submissionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  useEffect(() => {
    currentMessagesRef.current = currentMessages;
  }, [currentMessages]);

  useEffect(() => {
    messageRef.current = message;

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    if (messageRef.current.trim() != "") {
      typingTimerRef.current = setTimeout(() => {
          console.log("Typing pause complete");
          typingTimerRef.current = null;
          if (currentMessagesRef.current.length > 0) {
            sendToBot();
          } else {
            console.log("No messages to send");
          }
      }, 3000);
    }
  }, [message]);

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

  if (user === 'loading' || !user || !chatID) return null

  // add message to firestore and get reply from bot
  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      const token = messagesRef.current[messagesRef.current.length - 1]?.token ?? 'START'
      const subtoken = messagesRef.current[messagesRef.current.length - 1]?.subtoken ?? 0
  
      const newMessage: ChatCompletionMessageParam<'user'> = {
        role: 'user',
        content,
        token,
        subtoken
      }
  
  
      // Add the user message to the state so we can see it immediately
      setMessages((prevMsgs) => {
        const updatedMessages = [...prevMsgs, newMessage];
        messagesRef.current = updatedMessages;
        return updatedMessages;
      })
  
      setCurrentMessages((prev) => {
        const updatedCurrentMessages = [...prev, content];
        currentMessagesRef.current = updatedCurrentMessages;
        return updatedCurrentMessages;
      })


      // send the user message to the bot

      await addMessageToFirestore(user.uid, chatID, newMessage)
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

  function isDangerToSelfOrOthers(message: string): boolean {
    // List of keywords that might indicate danger to self or others
    const keywords = [
        "suicide", "kill myself", "end it all", "harm myself",
        "suicidal", "self-harm", "hurt myself", "take my life",
        "die", "cannot go on", "want to disappear", "feel worthless",
        "no point in living", "thinking of ending it", "give up on life",
        "danger to others", "kill them", "hurt others", "make them pay",
        "end their lives", "attack them", "they'll regret it"
    ];

    // Counterkeywords to check for negations
    const counterKeywords = [
        "do not ", "don't ", "never ", "not ", "can't ", "cannot ",
        "i don't want to ", "i'm not ", "shouldn't ", "wouldn't ",
        "isn't ", "haven't ", "hasn't "
    ];

    // Remove non-alphabetic characters (except periods for sentence boundary) and normalize the message to lowercase
    const normalizedMessage = message.toLowerCase().replace(/[^a-z\s\.]/gi, '');

    // Check if any keyword is in the user's message
    for (const keyword of keywords) {
        const keywordPattern = new RegExp(`\\b${keyword}\\b`, 'gi');
        // If the keyword is found, check for counterkeywords right before it within the same sentence
        if (keywordPattern.test(normalizedMessage)) {
            for (const counterKeyword of counterKeywords) {
                // Regex to match counterkeyword in the same sentence before the keyword
                const negationPattern = new RegExp(`(?:[^.]*?)\\b${counterKeyword}(.*?)\\b${keyword}\\b`, 'gi');
                if (negationPattern.test(normalizedMessage)) {
                    return false; // Counterkeyword negates the keyword in the same sentence
                }
            }
            return true; // No negation found, keyword indicates danger
        }
    }

    return false;
}


  const sendToBot = async () => {
    console.log(`Sending to bot with timers - submission: ${submissionTimerRef.current} and typing: ${typingTimerRef.current}`)
    if (!submissionTimerRef.current && !typingTimerRef.current) { 
      setIsLoadingAnswer(true)
      const token = messagesRef.current[messagesRef.current.length - 1]?.token ?? 'START'
      const subtoken = messagesRef.current[messagesRef.current.length - 1]?.subtoken ?? 0
  
      if (currentMessagesRef.current.length === 0) {
        let lastNonUserMessageIndex = -1
        for (let i = messagesRef.current.length - 1; i >= 0; i--) {
          if (messagesRef.current[i].role !== 'user') {
            lastNonUserMessageIndex = i
            break
          }
        }
        setCurrentMessages(messagesRef.current.slice(lastNonUserMessageIndex + 1).map((m) => m.content))
      }
  
      const newMessage: ChatCompletionMessageParam<'user'> = {
        role: 'user',
        content: currentMessagesRef.current[currentMessagesRef.current.length - 1],
        token,
        subtoken
      }
  
      const combinedMessage: ChatCompletionMessageParam<'user'> = {
        role: 'user',
        content: currentMessagesRef.current.join('\n'),
        token,
        subtoken
      }
  
      let messagesToProcess = messagesRef.current.slice(0, messagesRef.current.length - currentMessagesRef.current.length)
      messagesToProcess.push(combinedMessage)

      if (isDangerToSelfOrOthers(currentMessagesRef.current[currentMessagesRef.current.length - 1])) {
        const dangerMessage: ChatCompletionMessageParam<'assistant'> = {
          role: 'assistant',
          // content: "It sounds like you're in a difficult situation. If you're feeling suicidal, please contact a mental health professional immediately.\n\nIf you\'re in the UK, you can call the Samaritans on 116 123 or visit their website at www.samaritans.org."
          content: "It sounds like you're in a difficult situation. Help and support is available right now if you need it. You do not have to struggle with difficult feelings alone. If you're in the UK, I strongly suggest you reach out to 988 Suicide and Crisis Lifeline. Here's some of their resources: [Call 988](tel:988) [Text 988](sms:988) [Chat Online](https://988lifeline.org/chat/?utm_source=calmi&utm_medium=web) [Official Website](https://988lifeline.org/?utm_source=google&utm_medium=web&utm_campaign=onebox)"
          // content: "No ahahahaaa don't kill yourself... you so sexy aha. ok google, search for rocket league clips on [google.com](https://google.com)"
        }
        setMessages((prevmsg) => {
          const updatedMessages = [...prevmsg, dangerMessage];
          messagesRef.current = updatedMessages;
          return updatedMessages;
        })
        await addMessageToFirestore(user.uid, chatID, dangerMessage)
        setIsLoadingAnswer(false)
        return
      }

      let reply = await getbotReply(messagesToProcess)
      if (!reply) return
      setCurrentMessages([])
  
      // end of the chat
      if (reply.find((r) => r.content === TERMINATING_MESSAGE) !== undefined) {
        setEndChat(true)
        setProgress({
          token: 'END',
          subtoken: 0
        })
        postprocess(user.uid, chatID, newMessage, true, messagesRef.current)
      }
  
      // Add the assistant message to the state
      for (const r of reply) {
        setMessages((prevmsg) => {
          const updatedMessages = [...prevmsg, r];
          messagesRef.current = updatedMessages;
          return updatedMessages;
        })
        await delay(r.content.length * 5)
      }
  
      // save to firestore
      await addMessageToFirestore(user.uid, chatID, reply)
      setIsLoadingAnswer(false)
    }
  }

  const processLinks = (content: string) => {
    const linkPattern = /\[([^\]]+)\]\(([^\)]+)\)/g;
    let match;
    const links = [];
    while ((match = linkPattern.exec(content)) !== null) {
      console.log(match);
      links.push({ label: match[1], url: match[2] });
    }
    return links;
  };
  
  

  // handle submit
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (!message || isLoadingAnswer) return
    if (message.length > 2000 || currentMessagesRef.current.join('\n').length + 2 + message.length > 2000) {
      toast.error('Message too long')
      return
    }
    setMessage('')
    await addMessage(message)

    if (submissionTimerRef.current) {
      clearTimeout(submissionTimerRef.current);
    }
    submissionTimerRef.current = setTimeout(() => {
      if (messageRef.current.trim() != "") {
        console.log(`Message in text box... waiting: '${messageRef.current}'`)
        submissionTimerRef.current = setTimeout(() => {
          console.log("Full pause complete");
          submissionTimerRef.current = null;
          sendToBot();
        }, 5000)
      } else {
        console.log("Submission pause complete");
        submissionTimerRef.current = null;
        typingTimerRef.current = null;
        sendToBot();
      }
    }, 2000);
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
    {msg.content.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
      const linkMatch = part.match(/\[([^\]]+)\]\(([^\)]+)\)/);
      if (linkMatch) {
        // return (
        //   <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        //     {linkMatch[1]}
        //   </a>
        // );
          return (
          <span key={i}></span>
        );
      }
      return <span key={i}>{part}</span>;
    })}
  </div>
  {processLinks(msg.content).map((link, i) => (
    <div key={i} className='w-full mt-2 '>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className='btn btn-primary w-full'
      >
        {link.label}
      </a>
    </div>
  ))}
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
