'use client'
import { Question } from '@/services/sanity/schema/survey'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

type Params = {
  Questions: Question[]
}
function Survey({ Questions }: Params) {
  const [completed, setCompleted] = useState(0)
  const path = usePathname()
  const currentStep = Number(useSearchParams().get('currentStep'))
  return (
    <div className='mt-5 p-4'>
      <p>
        {completed}/{Questions.length}
      </p>
      {Questions.map((question, i) => {
        switch (question.type) {
          case 'short':
            return (
              <div className='w-full form-control' key={i}>
                <label className='label' htmlFor={question.label}>
                  <span className='label-text'>
                    {i + 1}. {question.question}
                  </span>
                </label>
                <input
                  type='text'
                  id={question.label}
                  placeholder='Type here'
                  className='input input-bordered input-info w-full max-w-xs'
                />
              </div>
            )

          case 'long':
            return (
              <div className='w-full form-control' key={i}>
                <label className='label' htmlFor={question.label}>
                  <span className='label-text'>
                    {i + 1}. {question.question}
                  </span>
                </label>
                <textarea
                  className='textarea textarea-info'
                  placeholder={question.label}
                  id={question.question}
                ></textarea>
              </div>
            )

          case 'radio':
            return (
              <div className='w-full form-control' key={i}>
                <label className='label' htmlFor={question.label}>
                  <span className='label-text'>
                    {i + 1}. {question.question}
                  </span>
                </label>
                {question.options?.map((option, i) => (
                  <div key={i} className='flex gap-1 items-center'>
                    <input
                      type='radio'
                      name={question.label}
                      className='radio radio-info m-1'
                    />
                    <label className='label cursor-pointer'>
                      <span className='label-text'>{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            )

          case 'select':
            return (
              <div className='w-full form-control' key={i}>
                <label className='label' htmlFor={question.label}>
                  <span className='label-text'>
                    {i + 1}. {question.question}
                  </span>
                </label>
                {question.options?.map((option, i) => (
                  <div key={i} className='flex gap-1 items-center'>
                    <input
                      type='checkbox'
                      name={question.label}
                      className='checkbox checkbox-info m-1'
                    />
                    <label className='label cursor-pointer'>
                      <span className='label-text'>{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            )
          default:
            break
        }
      })}

      <Link href={path + '?currentStep=1'} className='btn btn-accent mt-8'>
        {currentStep === 0 ? 'Lets Chat' : 'Submit'}
      </Link>
    </div>
  )
}

export default Survey
