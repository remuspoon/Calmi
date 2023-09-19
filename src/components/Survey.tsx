'use client'
import { Question } from '@/services/sanity/schema/survey'
import React, { useState } from 'react'

type Params = {
  Questions: Question[]
}
function Survey({ Questions }: Params) {
  const [completed, setCompleted] = useState(0)
  return (
    <div className='border mt-5 p-4'>
      <p>
        {completed}/{Questions.length}
      </p>
      {Questions.map((question, i) => {
        switch (question.type) {
          case 'short':
            return (
              <div className='form-control w-full max-w-xs' key={i}>
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
              <div className='form-control w-full max-w-xs' key={i}>
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
              <div className='form-control w-full max-w-xs' key={i}>
                <label className='label' htmlFor={question.label}>
                  <span className='label-text'>
                    {i + 1}. {question.question}
                  </span>
                </label>
                <input
                  type='radio'
                  name='radio-7'
                  className='radio radio-info'
                />
                <input
                  type='radio'
                  name='radio-7'
                  className='radio radio-info'
                />
              </div>
            )
          default:
            break
        }
      })}
    </div>
  )
}

export default Survey
