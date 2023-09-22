import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp
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
export default db
