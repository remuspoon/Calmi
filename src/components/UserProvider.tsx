'use client'
import auth from '@/services/firebase/auth'
import { User, onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext<User | null>(null)

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      console.log('user', user)
    })
    return () => unsubscribe()
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const user = useContext(UserContext)
  return user
}

export default UserProvider
