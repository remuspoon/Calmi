import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import app from '.'

const db = getFirestore(app)

export const getUser = async (id: string) => {
  const userDocref = doc(db, 'users', id)
  const userSnap = await getDoc(userDocref)
  if (userSnap.exists()) {
    return userSnap.data()
  }
}
export default db
