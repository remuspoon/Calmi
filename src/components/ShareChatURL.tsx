'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
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
    <button className='btn btn-ghost btn-sm' onClick={copyToClip}>
      Copy
    </button>
  )
}

export default CopyChatURL
