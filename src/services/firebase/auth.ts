import {
  GoogleAuthProvider,
  User,
  getAuth,
  signInAnonymously,
  signInWithPopup,
  AdditionalUserInfo,
  getAdditionalUserInfo
} from 'firebase/auth'
import app from '.'

const auth = getAuth(app)

export const SigninWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)

  const additionalUserInfo = getAdditionalUserInfo(result)

  const user = result.user
  return { user, isNewUser: additionalUserInfo?.isNewUser }
}

export const SignInAnonymously = async () => {
  // check if user already signed in
  let user = JSON.parse(localStorage.getItem('user') || '{}') as User | null

  if (user) {
    return user
  }

  const result = await signInAnonymously(auth)
  user = result.user

  // save user to local storage
  localStorage.setItem('user', JSON.stringify(user))

  return user
}

export const Signout = async () => {
  await auth.signOut()
}

export default auth
