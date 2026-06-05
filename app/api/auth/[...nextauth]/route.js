import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import mongoose from 'mongoose'
import User from '@/models/User'
import connectDB from '../../../../lib/mongodb'  // adjust path


export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
  if (account.provider === "github" || account.provider === "google") {
    await connectDB()  // ← uses cached connection
    const currentUser = await User.findOne({ email: user.email })
    if (!currentUser) {
      await new User({
        email: user.email,
        username: user.email.split("@")[0],
      }).save()
    }
  }
  return true
},

// in session callback:
async session({ session }) {
  await connectDB()  // ← uses cached connection
  const dbuser = await User.findOne({ email: session.user.email })
  if (dbuser) {
    session.user.name = dbuser.username
  }
  return session
},
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }