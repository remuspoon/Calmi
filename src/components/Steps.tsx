import React from 'react'

function Steps({ currentStep }: { currentStep: number }) {
  return (
    <ul className='steps sticky top-0'>
      <li className={`step ${currentStep >= 0 && 'step-info'}`}>
        Pre-Chat Survey
      </li>
      <li className={`step ${currentStep >= 1 && 'step-info'}`}>Chat</li>
      <li className={`step ${currentStep >= 2 && 'step-info'}`}>
        Post-Chat Survey
      </li>
    </ul>
  )
}

export default Steps
