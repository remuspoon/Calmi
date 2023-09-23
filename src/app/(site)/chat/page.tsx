'use client'
import { getChats } from '@/services/firebase/firestore'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

function ChatDashboard() {
  const uid = useSearchParams().get('uid')
  const router = useRouter()
  const [chats, setChats] = React.useState<any[]>([])
  useEffect(() => {
    if (!uid) {
      router.replace('/')
      return
    }

    const f = async () => {
      try {
        const chats = await getChats(uid)
        console.log(chats)
        setChats(chats)
      } catch (error) {
        console.log(error)
        redirect('/')
      }
    }
    f()
  }, [])
  // let chats = []
  // console.log(uid)
  // try {
  //   chats = await getChats(uid)
  // } catch (error) {
  //   console.log(error)
  //   redirect('/')
  // }
  return (
    <div>
      {chats.map((c) => (
        <p key={c.id}>{c.id!}</p>
      ))}
    </div>
  )
}

export default ChatDashboard
