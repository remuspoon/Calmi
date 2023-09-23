'use client'

import Link from 'next/link'
import { useUser } from './UserProvider'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

function MyChatButton() {
  const uid = useUser()?.uid
  const router = useRouter()
  const pathName = usePathname()
  useEffect(() => {
    if (pathName !== '/chat') return
    if (!uid) {
      router.replace('/')
    }
  }, [pathName, uid])
  return (
    <Link
      href={'/chat?uid=' + uid}
      className='btn-sm sm:btn-md btn btn-info btn-outline'
    >
      My Chats
    </Link>
  )
}

export default MyChatButton
