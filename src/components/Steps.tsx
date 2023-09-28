import Link from 'next/link'
import React from 'react'

function Steps({
  currentStep,
  chatID
}: {
  currentStep: number
  chatID: string
}) {
  return (
    <ul className='steps print:hidden'>
      <Link
        href={'/chat/' + chatID + '?currentStep=0'}
        className={`step ${currentStep >= 0 && 'step-info'}`}
      >
        Pre-Chat Survey
      </Link>
      <Link
        href={'/chat/' + chatID + '?currentStep=1'}
        className={`step ${currentStep >= 1 && 'step-info'}`}
      >
        Chat
      </Link>
      <Link
        href={'/chat/' + chatID + '?currentStep=2'}
        className={`step ${currentStep >= 2 && 'step-info'}`}
      >
        Post-Chat Survey
      </Link>
    </ul>
  )
}

export default Steps
