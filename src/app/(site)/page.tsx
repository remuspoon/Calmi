import ChatButton from '@/components/ChatButton'
import MyChatButton from '@/components/MyChatButton'

export default function Home() {
  return (
    <div className='container border-slate-700 p-4 rounded-md mt-[20vh] flex items-center text-center justify-center flex-col'>
      <p className='uppercase font-black leading-10 text-8xl tracking-wider mb-8'>
        CALMI
      </p>
      <p className='w-3/4 mx-auto sm:text-lg text-primary font-semibold'>
        Hey I'm Calmi! I'm here to help you promote positive changes to your mental well-being with evidence-based techniques!
        <div><em className="text-xs text-gray-600">**If you are in a serious mental health crisis or state, please do not use Calmi and seek help from qualified healthcare professionals.**</em></div>
        <div className="text-xs text-gray-600">All your data is securely encrypted before storage, ensuring your conversations are only accessible by yourself.</div>
        
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
