"use client"

import React, { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z" />
    <path fill="#FF3D00" d="M6.3 14.7 12.9 19C14.7 14.6 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7Z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.4-8l-6.5 5C9.5 39.5 16.2 44 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.1 7l6.2 5.2C39.1 36.8 44 31 44 24c0-1.3-.1-2.3-.4-3.5Z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3ZM20.44 12.47c0-3.45-1.84-5.06-4.3-5.06-1.98 0-2.87 1.1-3.37 1.87V8.5H9.4c.04.52 0 11.5 0 11.5h3.38v-6.42c0-.34.03-.68.13-.92.27-.68.88-1.38 1.9-1.38 1.34 0 1.88 1.03 1.88 2.54V20H20v-6.9Z" />
  </svg>
)
const TwitterIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.2 1.8-2.2-.8.5-1.7.8-2.6 1-1.5-1.6-4.2-1.7-5.8-.1-1 1-1.4 2.4-1 3.7-3.3-.2-6.3-1.8-8.3-4.3-1.1 1.9-.5 4.4 1.3 5.6-.6 0-1.2-.2-1.7-.5 0 2 1.4 3.8 3.4 4.2-.6.2-1.2.2-1.8.1.5 1.7 2.1 2.9 4 2.9A8.4 8.4 0 0 1 2 18.6 11.8 11.8 0 0 0 8.3 20c7.6 0 11.8-6.4 11.8-11.9v-.5c.8-.6 1.4-1.2 1.9-1.8Z" />
  </svg>
)
const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.1V12h2.1V9.8c0-2.1 1.3-3.3 3.2-3.3.9 0 1.8.2 1.8.2v2h-1c-1 0-1.4.6-1.4 1.3V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12Z" />
  </svg>
)
const GithubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.17c-3.2.69-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.76 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.68 0-1.25.44-2.27 1.17-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.5 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.81 1.17 1.83 1.17 3.08 0 4.41-2.7 5.39-5.28 5.67.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
)
const AppleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.7 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.8 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 6.9 1.1 9.1.7 1.1 1.6 2.4 2.8 2.3 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.7-2.2.8-1.2 1.1-2.3 1.1-2.4 0 0-2.1-.8-2.1-3.8ZM14.4 5.8c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.2Z" />
  </svg>
)

const providers = [
  { id: "google", label: "Continue with Google", enabled: true, icon: <GoogleIcon /> },
  { id: "linkedin", label: "Continue with LinkedIn", enabled: false, icon: <LinkedInIcon /> },
  { id: "twitter", label: "Continue with Twitter", enabled: false, icon: <TwitterIcon /> },
  { id: "facebook", label: "Continue with Facebook", enabled: false, icon: <FacebookIcon /> },
  { id: "github", label: "Continue with GitHub", enabled: true, icon: <GithubIcon /> },
  { id: "apple", label: "Continue with Apple", enabled: false, icon: <AppleIcon /> },
]

const Login = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/Dashboard")
    }
  }, [status, router])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur p-8 shadow-xl border border-white/10">
        <h1 className="text-3xl font-bold text-white text-center">Login</h1>
        <p className="mt-2 text-center text-sm text-gray-300">
          Google and GitHub are active. Others are coming soon.
        </p>

        <div className="mt-8 space-y-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              disabled={!provider.enabled}
              onClick={() =>
                provider.enabled &&
                signIn(provider.id, { callbackUrl: "/Dashboard" })
              }
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 font-medium transition
                ${
                  provider.enabled
                    ? "bg-white text-black hover:bg-gray-100 cursor-pointer"
                    : "bg-gray-700 text-gray-300 opacity-70 cursor-not-allowed"
                }`}
            >
              <span className="flex items-center gap-3">
                {provider.icon}
                <span>{provider.label}</span>
              </span>

              {!provider.enabled && (
                <span className="text-xs text-gray-400">Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Login