import Chat from '@/components/Chat'
import Steps from '@/components/Steps'
import Survey from '@/components/Survey'
import { getSurvey } from '@/services/sanity/lib/queries'

async function ChatPage({
  searchParams
}: {
  searchParams: { currentStep: number }
}) {
  const currentStep = Number(searchParams.currentStep) || 0
  const surveys = await getSurvey()
  const prechatSurvey =
    surveys.find((s) => s.title === 'preChatSurvey')?.questions || []
  const postchatSurvey =
    surveys.find((s) => s.title === 'postChatSurvey')?.questions || []

  console.log('pre', prechatSurvey)
  console.log('post', postchatSurvey)
  return (
    <div className='flex flex-col container mx-auto min-h-screen'>
      <Steps currentStep={currentStep} />
      {currentStep === 0 && <Survey Questions={prechatSurvey} />}
      {currentStep === 1 && <Chat />}
      {currentStep === 2 && <Survey Questions={postchatSurvey} />}
    </div>
  )
}

export default ChatPage
