"use client"
import React, { useEffect, useMemo, useState } from "react"
import Script from "next/script"
import Link from "next/link"
import { fetchPayment, initiate, fetchuser, markPaymentDone } from "../actions/useractions"
import { useSearchParams, useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"


const Paymentpage = ({ username }) => {
    const [profile, setprofile] = useState("/banner/profile.png")
    const [banner, setbanner] = useState("/banner/cfw.jpg")
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setpayments] = useState([])
    const [loading, setloading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [paying, setpaying] = useState(false)

    const [paymentform, setpaymentform] = useState({
        name: "",
        email: "",
        mobile: "",
        message: "",
        amount: "",
    })

    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (searchParams.get("paymentdone") === "true") {
            router.push(`/${username}`)
        }
    }, [searchParams, router, username])

    useEffect(() => {
        getData()
    }, [username])

    const getData = async () => {
        try {
            setloading(true)

            const u = await fetchuser(username)
            if (!u) {
                setNotFound(true)
                return
            }

            setcurrentUser(u)
            setprofile(u.profilepicture || "/banner/profile.png")
            setbanner(u.coverpicture || "/banner/cfw.jpg")

            const dbpayment = await fetchPayment(username)
            setpayments(dbpayment || [])
        } catch (error) {
            toast.error("Failed to load creator page.", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "dark",
            })
        } finally {
            setloading(false)
        }
    }

    const validatePaymentForm = (customAmount = null) => {
  const name = paymentform.name.trim()
  const message = paymentform.message.trim()
  const email = paymentform.email.trim()
  const mobile = paymentform.mobile.trim()
  const amount = customAmount ?? Number(paymentform.amount)

  if (name.length < 4) return "Name must be at least 4 characters long."
  if (message.length < 5) return "Message must be at least 5 characters long."
  if (!email.includes("@")) return "Please enter a valid email."
  if (!/^\d{10}$/.test(mobile)) return "Number must be exactly 10 digits."
  if (!Number.isFinite(amount)) return "Please enter a valid amount."
  if (amount <= 5) return "Amount must be more than ₹5."
  if (amount >= 25000) return "Amount must be less than ₹25000."

  return null
}


   const handlechange = (e) => {
  const { name, value } = e.target

  if (name === "mobile") {
    setpaymentform({
      ...paymentform,
      [name]: value.replace(/\D/g, "").slice(0, 10),
    })
    return
  }

  setpaymentform({
    ...paymentform,
    [name]: value,
  })
}


   const pay = async (quickAmount) => {
  const finalAmount = quickAmount ?? Number(paymentform.amount)
  const errorMessage = validatePaymentForm(finalAmount)

  if (errorMessage) {
    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 4000,
      theme: "dark",
    })
    return
  }

  const updatedForm = {
    ...paymentform,
    amount: finalAmount,
  }

  try {
    setpaying(true)

    const order = await initiate(finalAmount * 100, username, updatedForm)

    if (order?.error) {
      toast.error(order.error, {
        position: "bottom-right",
        autoClose: 4000,
        theme: "dark",
      })
      setpaying(false)
      return
    }

    const options = {
      key: currentUser.razorpayid,
      amount: order.amount,
      currency: order.currency,
     name: currentUser?.name || "FundRazer",
description: `Support ${username}`,
image: currentUser?.profilepicture || "/banner/profile.png",
      order_id: order.id,
      prefill: {
        name: updatedForm.name,
        email: updatedForm.email,
        contact: updatedForm.mobile,
      },
      notes: {
        message: updatedForm.message,
        creator: username,
      },
      theme: {
        color: "#7c3aed",
      },
      handler: async function (response) {
        try {
          const res = await markPaymentDone(response.razorpay_order_id)

          if (!res?.success) {
            toast.error("Payment done but database update failed.", {
              position: "bottom-right",
              autoClose: 4000,
              theme: "dark",
            })
            setpaying(false)
            return
          }

          setpaying(false)
          toast.success("Payment successful!", {
            position: "bottom-right",
            autoClose: 2000,
            theme: "dark",
          })
          router.push(`/${username}?paymentdone=true`)
        } catch (error) {
          toast.error("Payment succeeded but saving failed.", {
            position: "bottom-right",
            autoClose: 4000,
            theme: "dark",
          })
          setpaying(false)
        }
      },
      modal: {
        ondismiss: function () {
          setpaying(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)

    rzp.on("payment.failed", function (response) {
      toast.error(
        response?.error?.description || "Payment failed. Please try again.",
        {
          position: "bottom-right",
          autoClose: 4000,
          theme: "dark",
        }
      )
      setpaying(false)
    })

    rzp.open()
  } catch (error) {
    toast.error("Something went wrong while starting the payment.", {
      position: "bottom-right",
      autoClose: 4000,
      theme: "dark",
    })
    setpaying(false)
    console.error(error)
  }
}

    const quickAmounts = [20, 50, 100, 500, 1000]

    const isInvalid = useMemo(() => {
        return !!validatePaymentForm()
    }, [paymentform])

    if (notFound) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#00091D] px-4 text-white text-center">
                <div className="text-6xl font-bold">404</div>
                <div className="text-2xl font-bold">User Not Found</div>
                <p className="text-slate-400">
                    No creator with username <span className="text-purple-400">@{username}</span> exists.
                </p>
                <Link
                    href="/"
                    className="mt-4 rounded-xl bg-purple-600 px-6 py-2 hover:bg-purple-700"
                >
                    Go Home
                </Link>
            </div>
        )
    }
    const totalEarnings = useMemo(() => {
  return payments.reduce((total, payment) => {
    return total + Number(payment.amount || 0)
  }, 0)
}, [payments])

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <main className="min-h-screen bg-[#00091D] text-white">
                <section className="relative">
                    <img
                        className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px] lg:h-[420px]"
                        src={banner}
                        alt={`${username} cover`}
                    />

                    <div className="mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="relative -mt-14 flex flex-col items-center md:-mt-16 md:items-start">
                            <img
                                width={120}
                                height={120}
                                className="h-28 w-28 rounded-full border-4 border-[#00091D] object-cover shadow-xl sm:h-32 sm:w-32"
                                src={profile}
                                alt={`${username} profile`}
                            />

                            <div className="mt-4 text-center md:text-left">
                                <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                                    @{username}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                                    {currentUser?.bio || "Support this creator and help their work reach more people."}
                                </p>
                                <div className="mt-3 space-y-1 text-sm text-slate-400">
  <p>{payments.length} donations received</p>
  <p>Total earnings: <span className="font-semibold text-green-400">₹{totalEarnings}</span></p>
</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">
                    {loading ? (
                        <div className="rounded-3xl border border-white/10 bg-slate-800/60 p-8 text-center text-slate-400">
                            Loading creator page...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-white/10 bg-slate-800/70 p-5 shadow-lg sm:p-6">
                                <h2 className="text-xl font-bold sm:text-2xl">Recent supporters</h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    People who recently supported this creator.
                                </p>

                                <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                                    {payments.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-slate-600 p-5 text-sm text-slate-400">
                                            No donations yet. Be the first supporter.
                                        </div>
                                    ) : (
                                        payments.map((e) => (
                                            <div
                                                key={e._id}
                                                className="rounded-2xl border border-slate-600 bg-slate-900/40 p-4"
                                            >
                                                <p className="text-sm sm:text-base">
                                                    <span className="font-semibold text-white">{e.name}</span>{" "}
                                                    donated <span className="font-semibold text-green-400">₹{e.amount}</span>
                                                </p>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    “{e.message || "Sent support"}”
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-slate-800/70 p-5 shadow-lg sm:p-6">
                                <h2 className="text-xl font-bold sm:text-2xl">Send your support</h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    Leave a message and choose an amount to support this creator.
                                </p>

                                <div className="mt-5 space-y-4">
                                    <input
                                        onChange={handlechange}
                                        className="w-full rounded-2xl bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter your full name"
                                        type="text"
                                        value={paymentform.name}
                                        name="name"
                                    />

                                    <input
                                        onChange={handlechange}
                                        className="w-full rounded-2xl bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter your message"
                                        type="text"
                                        value={paymentform.message}
                                        name="message"
                                    />
                                    <input
                                        onChange={handlechange}
                                        className="w-full rounded-2xl bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter email"
                                        type="email"
                                        value={paymentform.email}
                                        name="email"
                                    />

                                    <input
                                        onChange={handlechange}
                                        className="w-full rounded-2xl bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter Mobile Number"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={paymentform.mobile}
                                        name="mobile"
                                    />
                                    <input
                                        onChange={handlechange}
                                        className="w-full rounded-2xl bg-white px-4 py-3 text-black  focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter amount"
                                        type="number"
                                        value={paymentform.amount}
                                        name="amount"
                                        min="6"
                                        max="24999"
                                    />


                                    <button
                                        onClick={() => pay()}
                                        disabled={isInvalid || paying}
                                        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:from-purple-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {paying ? "Processing..." : "Pay now"}
                                    </button>
                                </div>

                                <div className="my-4 text-center text-sm text-slate-400">or choose a quick amount</div>

                                <div className="flex flex-wrap gap-3 justify-between ">
                                    {quickAmounts.map((amt) => (
                                        <button
                                            key={amt}
                                            className="rounded-xl bg-[#3D3C41] px-4 py-3 text-sm transition hover:bg-slate-600 "
                                            onClick={() => pay(amt)}
                                        >
                                            + ₹{amt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default Paymentpage