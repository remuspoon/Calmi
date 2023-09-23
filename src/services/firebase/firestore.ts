import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore'
import app from '.'
import { ChatCompletionMessageParam } from '@/components/Chat'

const db = getFirestore(app)

// path to collections
const chatPath = (uid: string) => `users/${uid}/chats`
const messagesPath = (uid: string, chatID: string) =>
  `${chatPath(uid)}/${chatID}/messages`
const surveyPath = (uid: string, chatID: string) =>
  `${chatPath(uid)}/${chatID}/survey`

// get user data
export const getUser = async (id: string) => {
  const userDocref = doc(db, 'users', id)
  const userSnap = await getDoc(userDocref)
  if (userSnap.exists()) {
    return userSnap.data()
  }
}

// get All chats
export const getChats = async (uid: string) => {
  const q = query(collection(db, chatPath(uid)))
  const querySnapshot = await getDocs(q)
  const chats: any[] = []
  querySnapshot.forEach((doc) => {
    chats.push({ ...doc.data(), id: doc.id })
  })
  return chats
}

// create chat document at users/{uid}/chats/{chatID}
export const createChat = (uid: string) => {
  const chatDocRef = doc(collection(db, 'users', uid, 'chats'))
  return chatDocRef
}

// add message to messages collection at users/{uid}/chats/{chatID}/messages
export const addMessageToFirestore = async (
  uid: string,
  chatID: string,
  message: ChatCompletionMessageParam | ChatCompletionMessageParam[]
) => {
  if (!Array.isArray(message)) {
    message = [message]
  }
  await Promise.all(
    message.map(async (m) => {
      await addDoc(collection(db, messagesPath(uid, chatID)), {
        ...m,
        timeStamp: serverTimestamp()
      })
    })
  )
}

export const getMessagesFromFirestore = async (
  uid: string,
  chatID: string,
  minTimestamp = new Date()
) => {
  const q = query(
    collection(db, messagesPath(uid, chatID)),
    where('timeStamp', '<=', minTimestamp),
    orderBy('timeStamp', 'desc'),
    limit(10)
  )

  const querySnapshot = await getDocs(q)

  const messages: ChatCompletionMessageParam[] = []

  querySnapshot.forEach((doc) => {
    messages.push(doc.data() as ChatCompletionMessageParam)
  })

  return messages.reverse()
}
export default db
