import ChatButton from '@/components/ChatButton';
import MyChatButton from '@/components/MyChatButton'
import Hero from 'public/Hero.png'

export default function Home() {
  return (
    <div>
      <div className='grid grid-col sm:grid sm:grid-cols-2 max-w-6xl'>
        <div className='relative mx-auto sm:col-span-1 sm:ml-14 lg:pr-20'>
          <div className="hidden lg:block absolute right-2 top-[200px] 
            w-10 h-10 
            border-t-[50px] border-t-transparent
            border-l-[75px] border-l-blue-950
            border-b-[50px] border-b-transparent ">
          </div>
          <div className="hidden lg:block absolute right-5 top-[200px] 
            w-10 h-10 
            border-t-[50px] border-t-transparent
            border-l-[75px] border-l-white
            border-b-[50px] border-b-transparent ">
          </div>
          <div className=' rounded-3xl flex flex-col items-center justify-center ml-5 pt-20 pb-16 min-w-[500px] lg:bg-white lg:shadow-lg lg:border-8 lg:border-blue-950'>
          <p className='uppercase font-black leading-12 text-7xl tracking-wider mb-2 text-center pb-4'>
              Hello! I'm Calmi :)
            </p>
            <div className='w-3/4 text-center flex flex-col items-center justify-center pb-4'>
              <p className='sm:text-xl text-primary font-semibold'>
                I'm here to help you promote positive changes to your mental well-being with evidence-based techniques!
              </p>
              
            </div>
            <div className='flex gap-2 mt-4'>
              <ChatButton label="Let's Chat" />
              <MyChatButton
                label='My Journal'
                className='btn btn-primary btn-sm sm:btn-md sm:w-40 text-white font-bold w-36'
                href='myjournal'
              />
            </div>
            <div className='w-3/4 text-center flex flex-col items-center justify-center mt-10'>
              <div className="text-xs text-gray-600 mt-2">**If you are in a serious mental health crisis or state, please do not use Calmi and seek help from qualified healthcare professionals.**</div>
              <div className="text-xs text-gray-600 mt-2">All your data is securely encrypted before storage, ensuring your conversations are only accessible by yourself.</div>
            </div>
          </div>
        </div>
        <div className='hidden lg:block min-w-[90vh] min-h-[70vh]'>
        <img src="Hero.png" alt="Hero" className='object-contain right-20 bottom-10 w-full'/>
      </div>
      </div>
      
    </div>
  );
}
