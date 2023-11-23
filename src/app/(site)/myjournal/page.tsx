'use client'
import ChatCard from '@/components/ChatCard'
import { useUser } from '@/components/UserProvider'
import { getCompletedChats } from '@/services/firebase/firestore'
import { useEffect, useState } from 'react'

function Page() {
  const user = useUser()
  const [journals, setJournals] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    if (user && user !== 'loading') {
      setLoading(true)
      getCompletedChats(user.uid).then((chats) => {
        console.log(chats)
        setJournals(chats)
        setLoading(false)
      })
    }
  }, [user])

  if (!user || user === 'loading' || loading) return <div>Loading...</div>
  if (journals.length === 0 && !loading) return <div>No journals</div>

  return (
    <div className='flex container mx-auto flex-wrap gap-2'>
      {journals.map((journal) => (
        <ChatCard chat={journal} key={journal.id} />
      ))}
    </div>
  )
}

export default Page
