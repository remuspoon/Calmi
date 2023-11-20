'use client'

import Link from 'next/link'
import { useUser } from './UserProvider'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

function MyChatButton({
  label,
  className
}: {
  label?: string
  className?: string
}) {
  const user = useUser()
  const router = useRouter()
  const pathName = usePathname()
  useEffect(() => {
    if (pathName !== '/chat') return
    if (user !== 'loading' && !user?.uid) {
      router.replace('/')
    }
  }, [pathName, router, user])
  if (user === 'loading' || !user) return null
  return (
    <Link
      href={'/chat?uid=' + user?.uid}
      className={className || 'btn-sm sm:btn-md btn btn-info btn-outline'}
    >
      {label || 'Chat History'}
    </Link>
  )
}

export default MyChatButton
