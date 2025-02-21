"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      // initial={{ y: -100, opacity: 0 }}
      // animate={{ y: 0, opacity: 1 }}
      // transition={{ duration: 0.5 }}
      className={` fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-white px-16 ${isScrolled ? "py-2" : "py-4 bg-gray-400 text-white"}`}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 h-20 ${
          isScrolled ? "bg-gray-400/60 backdrop-blur-md shadow-lg" : "bg-transparent"
        } rounded-3xl transition-all duration-300`}
      >
        <div className="flex justify-between items-center h-full px-8">
          <Link href="/" className= "hover:opacity-80 transition-opacity">
            <h1 className="text-2xl sm:text-4xl font-samarkan">nidhi</h1>
          </Link>
          <nav>
            <ul className="flex space-x-4 sm:space-x-6">
              {["Home","Listings", "Create", "About"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className=" text-sm sm:text-base hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <Link href={"/auth/signin"} className="px-8 py-4 bg-white text-gray-700 rounded-xl">Sign in</Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header

