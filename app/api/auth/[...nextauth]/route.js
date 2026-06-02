import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import mongoose from 'mongoose'
import User from '@/models/User'
import payment from '@/models/payment'


export const authoptions = NextAuth({
  providers: [
    // OAuth authentication providers...
   
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
    async signIn({ user, account, profile, email, credentials }) {
     if(account.provider == "github" )
     {
       console.log("database connecting");
       const client = await mongoose.connect(process.env.MGDB);
       console.log("database connected");
       
       const currentuser = await User.findOne({email :user.email})
       if(!currentuser){
        console.log("user not found");
        
        const newuser = new User({
          email : user.email ,
          username : user.email.split("@")[0],
         })
         await newuser.save()
       }
       else{
        console.log("user already exist");
       }      
      }
      return true
     },
     async session({session , user , token}){
      await mongoose.connect(process.env.MGDB)
       const dbuser = await User.findOne({email : session.user.email})
       console.log(session);
       session.user.name = dbuser.username
       console.log(`i am session ${session}`);
       return session
     }
    }
})

export {authoptions as GET  ,authoptions as POST}