import Chat from '@/components/Chat'
import Steps from '@/components/Steps'
import Survey from '@/components/Survey'
import {
  getPostChatSurvey,
  getPreChatSurvey
} from '@/services/sanity/lib/queries'

async function ChatPage({
  searchParams
}: {
  searchParams: { currentStep: number }
}) {
  const currentStep = Number(searchParams.currentStep) || 0
  const prechatSurvey = await getPreChatSurvey()
  const postchatSurvey = await getPostChatSurvey()
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
