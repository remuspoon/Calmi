import ChatButton from '@/components/ChatButton'
import MyChatButton from '@/components/MyChatButton'

export default function Home() {
  return (
    <div className='container border-slate-700 p-4 rounded-md mt-[20vh] flex items-center text-center justify-center flex-col'>
      <p className='uppercase font-black leading-10 text-8xl tracking-wider mb-8'>
        CALMI
      </p>
      <p className='w-3/4 mx-auto sm:text-lg text-primary font-semibold'>
        Discover the power of our mental health chat bot! Calmi is designed to guide you through
        evidence-based techniques that can help improve your mental well-being
        and promote positive change.
        All your data is securely encrypted before storage, ensuring your conversations remain confidential and protected.
      </p>
      <div className='flex gap-2 mt-4'>
        <ChatButton label="Let's Chat" />
        <MyChatButton
          label='My Journal'
          className='btn btn-primary btn-sm sm:btn-md sm:w-40 text-white font-bold w-36'
          href='myjournal'
        />
      </div>
    </div>
  )
}
