'use client'
import ChatCard from '@/components/ChatCard'
import { useUser } from '@/components/UserProvider'
import { getCompletedChats } from '@/services/firebase/firestore'
import { useEffect, useState } from 'react'

function Page() {
  const user = useUser()
  const [journals, setJournals] = useState<any[]>([])
  useEffect(() => {
    if (user && user !== 'loading') {
      getCompletedChats(user.uid).then((chats) => {
        setJournals(chats)
      })
    }
  }, [user])

  if (!user || user === 'loading') return <div>Loading...</div>
  if (journals.length === 0) return <div>No journals</div>
  return (
    <div className='flex flex-wrap'>
      {journals.map((journal) => {
        return <ChatCard chat={journal} key={journal.id} />
      })}
    </div>
  )
}

export default Page
