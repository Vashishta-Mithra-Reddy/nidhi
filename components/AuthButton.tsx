// components/AuthButton.js
"use client"
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase' 

export const SignInButton = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-8 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
    >
      Sign in
    </button>
  )
}

export const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-8 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
    >
      Sign out
    </button>
  )
}