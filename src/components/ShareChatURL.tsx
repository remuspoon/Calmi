'use client'

import { useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

function CopyChatURL() {
  const params = useParams()
  if (params.chatID === undefined) return null
  console.log('params', params)
  async function copyToClip() {
    await navigator.clipboard.writeText(location.href)
    toast.success('Copied to clipboard')
  }

  return (
    <button className='btn btn-ghost btn-sm text-white ' onClick={copyToClip}>
      Copy
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      >
        <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
        <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
      </svg>
    </button>
  )
}

export default CopyChatURL
