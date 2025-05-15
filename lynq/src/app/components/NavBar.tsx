"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MenuIcon, XIcon } from "lucide-react"
import { TrendingUpIcon } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="lg:w-[80%] mx-auto py-8 px-6 border-b border-slate-300 backdrop-blur-md sticky top-0 z-50 rounded-b-lg">

      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-emerald-500 rounded-md flex items-center justify-center">
              <TrendingUpIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Lynq</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="cursor-pointer md:hidden text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-xl p-4 mt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col space-y-4 py-2">
            <Link
              href="#"
              className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="#"
              className="bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
