// import Steps from '@/components/Steps'
// import Survey from '@/components/Survey'
import { getSurvey } from '@/services/sanity/lib/queries'
import dynamic from 'next/dynamic'

const Chat = dynamic(() => import('../../../../components/Chat'), {
  ssr: false
})
async function ChatPage({
  searchParams,
  params
}: {
  searchParams: { currentStep: number; completed: number }
  params: { chatID: string }
}) {
  // let currentStep = Number(searchParams.currentStep)

  const completed = Boolean(Number(searchParams.completed))

  // if (!currentStep && !completed) currentStep = 0

  const surveys = await getSurvey()
  const prechatSurvey =
    surveys.find((s) => s.title === 'preChatSurvey')?.questions || []
  const postchatSurvey =
    surveys.find((s) => s.title === 'postChatSurvey')?.questions || []
  return (
    <div className='flex flex-col container mx-auto min-h-screen'>
      {/* <Steps currentStep={currentStep ?? 3} chatID={params?.chatID} /> */}
      {/* {currentStep === 0 && <Survey Questions={prechatSurvey} />} */}
      {/* {currentStep === 1 && <Chat />} */}
      <Chat />
      {/* {currentStep === 2 && <Survey Questions={postchatSurvey} />} */}
      {completed && (
        <p className='mt-10 font-bold text-white text-center text-2xl'>
          Thank you for completing the survey
        </p>
      )}
    </div>
  )
}

export default ChatPage
