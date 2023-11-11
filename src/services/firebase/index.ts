// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const prodfirebaseConfig = {
  apiKey: 'AIzaSyAK5AiyhB1bnSHLXmI1zh-h0FiJHleAO6g',
  authDomain: 'cbtbot-e0da3.firebaseapp.com',
  projectId: 'cbtbot-e0da3',
  storageBucket: 'cbtbot-e0da3.appspot.com',
  messagingSenderId: '812528510538',
  appId: '1:812528510538:web:73ff2981f707c8f9fca8b3'
}

const devfirebaseConfig = {
  apiKey: 'AIzaSyCyi2LA1l2jnrA34er1rryTe0MBW8OUmbA',
  authDomain: 'cbtchat-d05a3.firebaseapp.com',
  projectId: 'cbtchat-d05a3',
  storageBucket: 'cbtchat-d05a3.appspot.com',
  messagingSenderId: '801361207938',
  appId: '1:801361207938:web:5583badb6f3b5b05d24a9b'
}
let firebaseConfig = devfirebaseConfig
if (process.env.NODE_ENV === 'production') {
  firebaseConfig = prodfirebaseConfig
  console.log('prod')
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default app
