import ChatButton from '@/components/ChatButton'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='container border-slate-700 p-4 rounded-md min-h-screen flex items-center text-center justify-center flex-col'>
      <p className='uppercase font-black leading-10 text-4xl tracking-wider bg-clip-text bg-gradient-to-r from-orange-500 to-blue-400 text-transparent '>
        Welcome to CBTChat Bot!
      </p>
      <p className='text-lg'>
        Discover the power of Cognitive Behavioral Therapy (CBT) with our
        interactive chatbot. Our CBTChat Bot is designed to guide you through
        evidence-based techniques that can help improve your mental well-being
        and promote positive change.
      </p>
      <ChatButton label=' Start Quick Chat' />
    </div>
  )
}
