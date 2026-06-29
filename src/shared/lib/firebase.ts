import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'strata-music.firebaseapp.com',
  projectId: 'strata-music',
  storageBucket: 'strata-music.firebasestorage.app',
  messagingSenderId: '890412098737',
  appId: '1:890412098737:web:b711836e7971570f3f6e90',
}

const ACCESS_EMAIL = 'access@strata.app'

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export const signInWithPassword = (password: string) =>
  signInWithEmailAndPassword(auth, ACCESS_EMAIL, password)

export const signOutUser = () => signOut(auth)
