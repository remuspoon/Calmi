'use client'
import { Question, SanitySubmeta } from '@/services/sanity/schema/survey'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

type Params = {
  Questions: (SanitySubmeta & Question)[]
}
function Survey({ Questions }: Params) {
  const [completed, setCompleted] = useState(0)
  const [form, setForm] = useState<Record<string, any>>({})
  const router = useRouter()
  const handleSubmit = () => {
    console.log(form)
  }

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target
    // input type checkbox
    console.log(e.target.type)
    if (e.target.type === 'checkbox') {
      if (e.target.checked) {
        setForm((prev) => ({
          ...prev,
          [name]: !prev[name] ? [value] : [...prev[name], value]
        }))
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: prev[name].filter((item: string) => item !== value)
        }))
      }
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }
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
                  required={question.required}
                  type='text'
                  name={question._key}
                  id={question.label}
                  placeholder='Type here'
                  onChange={handleChange}
                  value={form[question._key] ?? ''}
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
                  required={question.required}
                  name={question._key}
                  onChange={handleChange}
                  value={form[question._key] ?? ''}
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
                      required={question.required}
                      type='radio'
                      name={question._key}
                      value={question.options![i]}
                      onChange={handleChange}
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
                      required={question.required}
                      type='checkbox'
                      name={question._key}
                      value={question.options![i]}
                      onChange={handleChange}
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
      <div className='flex justify-around'>
        <Link href={path + '?currentStep=1'} className='btn btn-neutral mt-8'>
          Skip
        </Link>

        <button
          type='submit'
          onClick={() => {
            router.push(
              currentStep === 0
                ? path + '?currentStep=1'
                : path + '?completed=1'
            )
            handleSubmit
          }}
          className='btn btn-accent mt-8'
        >
          {currentStep === 0 ? 'Lets Chat' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default Survey
