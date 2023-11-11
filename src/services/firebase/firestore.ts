import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore'
import app from '.'
import { ChatCompletionMessageParam } from '../openai/chat'

const db = getFirestore(app)

// path to collections
const chatPath = `chats`
const messagesPath = (chatID: string) => `${chatPath}/${chatID}/messages`
// const surveyPath = (uid: string, chatID: string) =>
//   `${chatPath(uid)}/${chatID}/survey`

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
  const q = query(collection(db, chatPath), orderBy('timeStamp', 'asc'))
  const querySnapshot = await getDocs(q)
  const chats: any[] = []
  querySnapshot.forEach((doc) => {
    chats.push({ ...doc.data(), id: doc.id })
  })

  return chats
}

// create chat document at users/{uid}/chats/{chatID}
export const createChat = async (uid: string) => {
  const chatDocRef = await addDoc(collection(db, chatPath), {
    timeStamp: serverTimestamp()
  })
  return chatDocRef
}

function removeUndefinedAndNull(obj: any) {
  const cleanedObject: any = {}
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleanedObject[key] = obj[key]
    }
  }
  return cleanedObject
}

// add message to messages collection at users/{uid}/chats/{chatID}/messages
export const addMessageToFirestore = async (
  uid: string,
  chatID: string,
  message:
    | ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]
    | ChatCompletionMessageParam<'user' | 'assistant' | 'system'>
) => {
  if (!Array.isArray(message)) {
    message = [message]
  }
  await Promise.all(
    message.map(async (m: any) => {
      await addDoc(collection(db, messagesPath(chatID)), {
        ...removeUndefinedAndNull(m),
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
    collection(db, messagesPath(chatID)),
    where('timeStamp', '<=', minTimestamp),
    orderBy('timeStamp', 'desc')
    // limit(10)
  )

  const querySnapshot = await getDocs(q)

  const messages: ChatCompletionMessageParam<'user'>[] = []

  querySnapshot.forEach((doc) => {
    messages.push(doc.data() as ChatCompletionMessageParam<'user'>)
  })

  return messages.reverse()
}

// export const getSurveyFromFirestore = async (uid: string, chatID: string) => {
//   const surveyDocRef = doc(db, surveyPath(uid, chatID))
//   const surveySnap = await getDoc(surveyDocRef)
//   if (surveySnap.exists()) {
//     return surveySnap.data()
//   }
// }

export const deleteChatFromFirestore = async (uid: string, chatID: string) => {
  const chatDocRef = doc(db, chatPath, chatID)
  await deleteDoc(chatDocRef)
}

// export const addSurveyToFirestore = async (
//   uid: string,
//   chatID: string,
//   survey: 'pre' | 'post',
//   data: any
// ) => {
//   let docRef = doc(db, surveyPath(uid, chatID), survey)
//   await setDoc(docRef, data)
// }

export default db
