"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { auth } from '@/lib/firebase'
import { SignInButton, SignOutButton } from './AuthButton'
import { onAuthStateChanged, User } from 'firebase/auth'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Campaigns', path: '/campaigns' },
  { name: 'Create', path: '/create-campaign' },
  { name: 'Profile', path: '/profile' }
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    // Auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      unsubscribe()
    }
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 text-white px-16 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 h-20 ${
          isScrolled ? "bg-gray-400/60 backdrop-blur-md shadow-lg" : "bg-gray-400/60"
        } rounded-3xl transition-all duration-300 py-12`}
      >
        <div className="flex justify-between items-center h-full px-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-2xl sm:text-4xl font-samarkan">nidhi</h1>
          </Link>
          <nav>
            <ul className="flex space-x-4 sm:space-x-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm sm:text-base hover:text-primary hover:text-gray-300 hover:mb-1 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            {user ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header

