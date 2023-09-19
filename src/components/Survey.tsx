import React from 'react'

type Params = {
  surveyGetter: () => Promise<any[]>
}
async function Survey({ surveyGetter }: Params) {
  const survey = await surveyGetter()
  return (
    <div>
      {survey.map((question, i) => (
        <p key={i}>{survey}</p>
      ))}
    </div>
  )
}

export default Survey
