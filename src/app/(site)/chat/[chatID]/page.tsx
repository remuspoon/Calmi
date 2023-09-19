import Chat from '@/components/Chat'
import Survey from '@/components/Survey'
import { getPreChatSurvey } from '@/services/sanity/lib/queries'
import { useState } from 'react'

async function ChatPage({
  searchParams
}: {
  searchParams: { currentStep: number }
}) {
  const currentStep = searchParams.currentStep || 0

  return (
    <div>
      {currentStep === 0 && (await Survey({ surveyGetter: getPreChatSurvey }))}
      {currentStep === 1 && <Chat />}
      {currentStep === 2 && (await Survey({ surveyGetter: getPreChatSurvey }))}
    </div>
  )
}

export default ChatPage
