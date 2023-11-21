import ChatButton from '@/components/ChatButton'
import MyChatButton from '@/components/MyChatButton'

export default function Home() {
  return (
    <div className='container border-slate-700 p-4 rounded-md mt-[20vh] flex items-center text-center justify-center flex-col'>
      <p className='uppercase font-bold leading-10 text-4xl tracking-wider'>
        CBTChat Bot
      </p>
      <p className='text-lg text-primary font-semibold'>
        Discover the power of Cognitive Behavioral Therapy (CBT) with our
        interactive chatbot. Our CBTChat Bot is designed to guide you through
        evidence-based techniques that can help improve your mental well-being
        and promote positive change.
      </p>
      <div className='flex gap-2'>
        <ChatButton label='New Chat' />
        <MyChatButton
          label='My Journal'
          className='btn btn-primary btn-sm sm:btn-md w-40 text-white font-bold'
        />
      </div>
    </div>
  )
}
