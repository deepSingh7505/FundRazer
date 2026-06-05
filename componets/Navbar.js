"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import Link from 'next/link'
import { useState, useRef, useEffect } from "react"
import { searchusers } from "../actions/useractions"
import Image from "next/image"

const Navbar = () => {
  const { data: session } = useSession()
  const [showdrop, setshowdrop] = useState(false)
  const [query, setquery] = useState("")
  const [results, setresults] = useState([])
  const [showresults, setshowresults] = useState(false)
  const [searching, setsearching] = useState(false)
  const searchref = useRef(null)

  const logout = () => {
    const ans = confirm("Do You Want to SignOut")
    if (ans) signOut()
  }

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleclick = (e) => {
      if (searchref.current && !searchref.current.contains(e.target)) {
        setshowresults(false)
      }
    }
    document.addEventListener("mousedown", handleclick)
    return () => document.removeEventListener("mousedown", handleclick)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setresults([])
      setshowresults(false)
      return
    }
    const timer = setTimeout(async () => {
      setsearching(true)
      const data = await searchusers(query)
      setresults(data)
      setshowresults(true)
      setsearching(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  
     return (
  <>
    <nav className='bg-[#0B1222] text-white px-4 py-3'>

      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-3'>

        {/* Logo */}
       <div className="flex items-center gap-2 rounded-full">
      <Image src="/logo.svg" alt="Logo" width={160} height={40} />
    </div>

        {/* Search Box */}
        <div
          ref={searchref}
          className='relative w-full md:w-[280px]'
        >
          <div className='flex items-center bg-[#0d1f3c] border border-slate-600 rounded-full px-3 py-1.5 gap-2'>
            <svg
              className="w-4 h-4 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>

            <input
              type="text"
              value={query}
              onChange={(e) => setquery(e.target.value)}
              onFocus={() => results.length > 0 && setshowresults(true)}
              placeholder="Search creators..."
              className="bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none w-full"
            />

            {searching && (
              <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </div>

          {showresults && (
            <div className='absolute top-10 left-0 w-full bg-[#0d1f3c] border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden'>
              {results.length === 0 ? (
                <div className='px-4 py-3 text-slate-400 text-sm'>
                  No creators found
                </div>
              ) : (
                <ul>
                  {results.map((user) => (
                    <li key={user._id}>
                      <Link
                        href={`/${user.username}`}
                        onClick={() => {
                          setshowresults(false)
                          setquery("")
                        }}
                        className='flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 transition-colors'
                      >
                        <img
                          src={user.profilepicture || "/banner/profile.png"}
                          alt={user.username}
                          className='w-8 h-8 rounded-full object-cover border border-slate-500'
                        />
                        <span className='text-sm font-medium'>
                          @{user.username}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className='flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 items-center'>
          <Link href="/">Home</Link>
          <Link href="/About">About</Link>

          {!session && (
            <Link href="/Login">
              <button
                type="button"
                className="text-white bg-gradient-to-br cursor-pointer from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-base text-sm px-4 py-2"
              >
                Login
              </button>
            </Link>
          )}

          {session && (
            <div className="relative">
              <button
                onClick={() => setshowdrop(!showdrop)}
                className="inline-flex items-center justify-center text-white cursor-pointer"
                type="button"
              >
                Welcome {session.user.name}
                <svg
                  className="w-4 h-4 ms-1.5 -me-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`z-10 ${
                  showdrop ? "" : "hidden"
                } bg-slate-600 border border-slate-500 rounded-xl shadow-lg w-44 absolute top-9 right-0`}
              >
                <ul className="p-2 text-sm font-medium">
                  <li>
                    <Link
                      href="/Dashboard"
                      onClick={() => setshowdrop(false)}
                      className="hover:bg-slate-400 inline-flex items-center w-full p-2 rounded"
                    >
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={`/${session.user.name}`}
                      onClick={() => setshowdrop(false)}
                      className="hover:bg-slate-400 inline-flex items-center w-full p-2 rounded"
                    >
                      Your Page
                    </Link>
                  </li>

                  <li>
                    <Link
                      onClick={logout}
                      href="#"
                      className="hover:bg-slate-400 inline-flex items-center w-full p-2 rounded"
                    >
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>

    </nav>
  </>
)
  
}

export default Navbar