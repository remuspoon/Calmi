import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import app from '.'
import { ChatCompletionMessageParam } from '../openai/chat'

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

export const updateUser = async (id: string, data: any) => {
  const userDocref = doc(db, 'users', id)
  await setDoc(userDocref, data)
}

// get All chats
export const getChats = async (uid: string) => {
  const q = query(collection(db, chatPath(uid)), orderBy('timeStamp', 'asc'))
  const querySnapshot = await getDocs(q)
  const chats: any[] = []
  querySnapshot.forEach((doc) => {
    chats.push({ ...doc.data(), id: doc.id })
  })
  return chats
}

// get completed chats
export const getCompletedChats = async (uid: string) => {
  const q = query(
    collection(db, chatPath(uid)),
    where('completed', '==', true),
    orderBy('timeStamp', 'asc')
  )
  const querySnapshot = await getDocs(q)
  const chats: any[] = []
  querySnapshot.forEach((doc) => {
    chats.push({ ...doc.data(), id: doc.id })
  })
  console.log(chats)
  return chats
}

// create chat document at users/{uid}/chats/{chatID}
export const createChat = async (uid: string) => {
  const chatDocRef = await addDoc(collection(db, chatPath(uid)), {
    timeStamp: serverTimestamp(),
    timeSpent: 0,
    completed: false,
    summary: '',
    distortedThoughts: '',
    reframedThoughts: ''
  })
  return chatDocRef
}

export const updateChatSession = async (
  uid: string,
  chatID: string,
  time: number
) => {
  console.log('updating chat session', time)
  const chatDocRef = doc(db, chatPath(uid), chatID)
  await updateDoc(chatDocRef, {
    timeSpent: increment(time)
  })
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
      await addDoc(collection(db, messagesPath(uid, chatID)), {
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
    collection(db, messagesPath(uid, chatID)),
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

export const getSurveyFromFirestore = async (uid: string, chatID: string) => {
  const surveyDocRef = doc(db, surveyPath(uid, chatID))
  const surveySnap = await getDoc(surveyDocRef)
  if (surveySnap.exists()) {
    return surveySnap.data()
  }
}

export const deleteChatFromFirestore = async (uid: string, chatID: string) => {
  const chatDocRef = doc(db, chatPath(uid), chatID)
  await deleteDoc(chatDocRef)
}

export const addSurveyToFirestore = async (
  uid: string,
  chatID: string,
  survey: 'pre' | 'post',
  data: any
) => {
  let docRef = doc(db, surveyPath(uid, chatID), survey)
  await setDoc(docRef, data)
}

export default db
