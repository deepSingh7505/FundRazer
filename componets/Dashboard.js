"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { fetchuser, updateprofile } from "../actions/useractions"
import { ToastContainer, toast, Bounce } from "react-toastify"

const Dashboard = () => {
  const { data: session, update, status } = useSession()
  const router = useRouter()

  const [form, setform] = useState({
    name: "",
    email: "",
    username: "",
    profilepicture: "",
    coverpicture: "",
    razorpayid: "",
    razorpaysecret: "",
  })

  const [loading, setloading] = useState(true)
  const [submitting, setsubmitting] = useState(false)

  const inputClass =
    "w-full rounded-2xl bg-[#EEEEEE] px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"

  const handlechange = (e) => {
    setform((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/Login")
      return
    }

    if (status === "authenticated" && session?.user?.name) {
      getData()
    }
  }, [status, session, router])

  const getData = async () => {
    try {
      const u = await fetchuser(session.user.name)
      if (!u) return

      setform({
        name: u.name || "",
        email: u.email || "",
        username: u.username || "",
        profilepicture: u.profilepicture || "",
        coverpicture: u.coverpicture || "",
        razorpayid: u.razorpayid || "",
        razorpaysecret: u.razorpaysecret || "",
      })
    } catch (error) {
      toast.error("Failed to load profile data.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Bounce,
      })
    } finally {
      setloading(false)
    }
  }

  const handlesubmit = async (e) => {
    e.preventDefault()

    setsubmitting(true)

    try {
      const res = await updateprofile(form, session.user.name)

      if (res?.error) {
        toast.error(res.error, {
          position: "bottom-right",
          autoClose: 2000,
          theme: "dark",
          transition: Bounce,
        })
        return
      }

      if (res?.user) {
        setform({
          name: res.user.name || "",
          email: res.user.email || "",
          username: res.user.username || "",
          profilepicture: res.user.profilepicture || "",
          coverpicture: res.user.coverpicture || "",
          razorpayid: res.user.razorpayid || "",
          razorpaysecret: res.user.razorpaysecret || "",
        })
      }

      await update()

      toast.success("User info updated!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      })
    } catch (error) {
      toast.error("Something went wrong while updating profile.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Bounce,
      })
    } finally {
      setsubmitting(false)
    }
  }

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Welcome To Your Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Manage your creator profile and payment details.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-800/80 p-4 shadow-xl sm:p-6 md:p-8">
            {loading ? (
              <div className="py-10 text-center text-slate-400">
                Loading profile...
              </div>
            ) : (
              <form onSubmit={handlesubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold sm:text-base">
                      Name
                    </label>
                    <input
                      onChange={handlechange}
                      className={inputClass}
                      value={form.name}
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold sm:text-base">
                      Email
                    </label>
                    <input
                      className="w-full rounded-2xl bg-slate-300 px-4 py-3 text-black cursor-not-allowed"
                      value={form.email}
                      type="email"
                      name="email"
                      disabled
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold sm:text-base">
                      Username
                    </label>
                    <input
                      onChange={handlechange}
                      className={inputClass}
                      value={form.username}
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold sm:text-base">
                      <label>
                        Profile Picture URL{" "}
                        <span className="text-xs font-medium text-yellow-400">(leave empty to use default)</span>
                      </label>
                    </label>
                    <input
                      onChange={handlechange}
                      className={inputClass}
                      value={form.profilepicture}
                      type="text"
                      name="profilepicture"
                      placeholder="Paste profile image URL"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold sm:text-base">
                      <label>
                        Cover Picture URL{" "}
                        <span className="text-xs font-medium text-yellow-400">(leave empty to use default)</span>
                      </label>
                    </label>
                    <input
                      onChange={handlechange}
                      className={inputClass}
                      value={form.coverpicture}
                      type="text"
                      name="coverpicture"
                      placeholder="Paste cover image URL"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold sm:text-base">
                      Razorpay ID
                    </label>
                    <input
                      onChange={handlechange}
                      className={inputClass}
                      value={form.razorpayid}
                      type="text"
                      name="razorpayid"
                      placeholder="Enter Razorpay ID"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold sm:text-base">
                      Razorpay Secret
                    </label>
                    <input
                      onChange={handlechange}
                      className={inputClass}
                      value={form.razorpaysecret}
                      type="text"
                      name="razorpaysecret"
                      placeholder="Enter Razorpay Secret"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-gradient-to-bl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-base"
                  >
                    {submitting ? "Updating..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard