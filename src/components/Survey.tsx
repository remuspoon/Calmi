import { Question } from '@/services/sanity/schema/preChatSurvey'
import React from 'react'

type Params = {
  Questions: Question[]
}
function Survey({ Questions }: Params) {
  return (
    <div>
      {Questions.map((question, i) => (
        <p key={i}>{question.question}</p>
      ))}
    </div>
  )
}

export default Survey
