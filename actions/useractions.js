"use server"

import Razorpay from "razorpay"
import Payment from "../models/payment"
import User from "../models/User"
import connectDB from "@/lib/mongodb"

export const initiate = async (amount, to_username, paymentform) => {
  await connectDB()

  const user = await User.findOne({ username: to_username }).lean()
  if (!user) {
    return { error: "User not found" }
  }

  if (!user.razorpayid || !user.razorpaysecret) {
    return { error: "Receiver Razorpay account is not configured" }
  }

  const amountInPaise = Number(amount)
  if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
    return { error: "Invalid amount" }
  }

  const instance = new Razorpay({
    key_id: user.razorpayid,
    key_secret: user.razorpaysecret,
  })

  const options = {
    amount: amountInPaise,
    currency: "INR",
  }

  const order = await instance.orders.create(options)

  await Payment.create({
    oid: order.id,
    amount: amountInPaise / 100,
    to_user: to_username,
    name: paymentform?.name || "",
    message: paymentform?.message || "",
  })

  return order
}

export const fetchuser = async (username) => {
  await connectDB()

  const u = await User.findOne({ username }).lean()
  if (!u) return null

  return {
    ...u,
    _id: u._id.toString(),
  }
}

export const fetchPayment = async (username) => {
  await connectDB()

  const payments = await Payment.find({ to_user: username  , done: true} )
    .sort({ amount: -1 })
    .lean()

  return payments.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
  }))
}


export const updateprofile = async (data, oldusername) => {
  await connectDB()

  const ndata = data instanceof FormData ? Object.fromEntries(data) : data

  if (!ndata?.email || !ndata?.username) {
    return { error: "Email and username are required" }
  }

  const currentUser = await User.findOne({ email: ndata.email }).lean()
  if (!currentUser) {
    return { error: "User not found" }
  }

  if (oldusername !== ndata.username) {
    const existingUser = await User.findOne({ username: ndata.username }).lean()

    if (existingUser) {
      return { error: "Username Already Taken!" }
    }

    await User.updateOne(
      { email: ndata.email },
      {
        $set: {
          name: ndata.name,
          username: ndata.username,
          profilepicture: ndata.profilepicture,
          coverpicture: ndata.coverpicture,
          razorpayid: ndata.razorpayid,
          razorpaysecret: ndata.razorpaysecret,
        },
      }
    )

    await Payment.updateMany(
      { to_user: oldusername },
      { $set: { to_user: ndata.username } }
    )
  } else {
    await User.updateOne(
      { email: ndata.email },
      {
        $set: {
          name: ndata.name,
          username: ndata.username,
          profilepicture: ndata.profilepicture,
          coverpicture: ndata.coverpicture,
          razorpayid: ndata.razorpayid,
          razorpaysecret: ndata.razorpaysecret,
        },
      }
    )
  }

  const updatedUser = await User.findOne({ email: ndata.email }).lean()

  return {
    success: true,
    user: {
      ...updatedUser,
      _id: updatedUser._id.toString(),
    },
  }
}

export const searchusers = async (query) => {
  await connectDB()

  if (!query || query.trim().length < 2) return []

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const users = await User.find({
    username: { $regex: escaped, $options: "i" },
  })
    .select("username profilepicture")
    .limit(8)
    .lean()

  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }))
}


export const markPaymentDone = async (oid) => {
  try {
    await connectDB()

    await Payment.findOneAndUpdate(
      { oid: oid },
      { done: true },
      { new: true }
    )

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}