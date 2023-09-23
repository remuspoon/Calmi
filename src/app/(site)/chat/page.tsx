import { getChats } from '@/services/firebase/firestore'
import { redirect } from 'next/navigation'
import React from 'react'

async function ChatDashboard({
  searchParams
}: {
  searchParams: { uid: string }
}) {
  let chats = []
  console.log(searchParams.uid)
  try {
    chats = await getChats(searchParams.uid)
  } catch (error) {
    console.log(error)
    redirect('/')
  }
  return (
    <div>
      {chats.map((c) => (
        <p key={c.id}>{c.id!}</p>
      ))}
    </div>
  )
}

export default ChatDashboard
