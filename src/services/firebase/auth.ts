import {
  GoogleAuthProvider,
  User,
  getAuth,
  signInAnonymously,
  signInWithPopup
} from 'firebase/auth'
import app from '.'

const auth = getAuth(app)

export const SigninWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  // const credential = GoogleAuthProvider.credentialFromResult(result)

  // const token = credential?.accessToken

  const user = result.user
  return user
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
