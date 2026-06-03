"use client"
import React from 'react'
import { useState ,useEffect } from 'react'
import { useSession , signIn , signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchuser , updateprofile } from '../actions/useractions'

const Dashboard = () => {
    const {data : session  , update ,status} = useSession()
    const router = useRouter()

    const [form, setform] = useState({})
    const handlechange = (e)=>{
        setform({...form ,[e.target.name]:e.target.value})
    }
    useEffect(() => {
         if (status === "loading") return 
         if (status === "unauthenticated") {
        router.push("/Home")
        return
    }
            getData()
     
    }, [session ,router])
    
  

    const handlesubmit = async(e)=>{
        update()
        let a = await updateprofile(e , session.user.name)
        alert("profile updated")
    }
    const getData = async () =>{
        let u = await fetchuser(session.user.name)
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
    }
  return (
    <main className='flex-1  flex flex-col items-center'>
        <h1 className=' my-5 font-bold text-2xl '>Welcome To Your Dashboard</h1>
       
        <form className=' flex flex-col gap-3' action={handlesubmit} >
        <div>
            <p className='ml-1 font-bold'>Name </p>
            <input onChange={handlechange} className='bg-[#EEEEEE] text-black focus:outline-none w-[45vw] px-2 py-1 rounded-full ' value={form.name ? form.name : ""} type="text" name="name" id="" />
        </div>
        <div>
            <p className='ml-1 font-bold'>Email </p>
            <input onChange={handlechange} className='bg-[#EEEEEE] text-black focus:outline-none w-[45vw] px-2 py-1 rounded-full ' value={form.email ? form.email : ""} type="email" name="email" id="" />
        </div>
        <div>
            <p className='ml-1 font-bold'>Username </p>
            <input onChange={handlechange} className='bg-[#EEEEEE] text-black focus:outline-none w-[45vw] px-2 py-1 rounded-full ' value={form.username ? form.username : ""} type="text" name="username" id="" />
        </div>
        <div>
            <p className='ml-1 font-bold'>Profile Picture </p>
            <input onChange={handlechange} className='bg-[#EEEEEE] text-black focus:outline-none w-[45vw] px-2 py-1 rounded-full ' value={form.profilepicture ? form.profilepicture : ""} type="text" name="profilepicture" id="" />
        </div>
        <div>
            <p className='ml-1 font-bold'>Cover Picture </p>
            <input onChange={handlechange} className='bg-[#EEEEEE] text-black focus:outline-none w-[45vw] px-2 py-1 rounded-full ' value={form.coverpicture ? form.coverpicture : ""}  type="text" name="coverpicture" id="" />
        </div>
        <div>
            <p className='ml-1 font-bold'>Rozorpay Id </p>
            <input onChange={handlechange} className='bg-[#EEEEEE] text-black focus:outline-none w-[45vw] px-2 py-1 rounded-full 'value={form.razorpayid ? form.razorpayid : ""} type="text" name="razorpayid" id="" />
        </div>
        <div>
            <p className='ml-1 font-bold'>Rozorpay Secret</p>
            <input onChange={handlechange} className='bg-[#EEEEEE] text-black focus:outline-none w-[45vw] px-2 py-1 rounded-full ' value={form.razorpaysecret ? form.razorpaysecret : ""} type="text" name="razorpaysecret" id="" />
        </div>
        
        <button type='submit' className='text-white bg-gradient-to-br cursor-pointer from-purple-600 to-blue-500 hover:bg-gradient-to-bl dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 my-3 text-center leading-5' >Submit</button>
        </form>
    </main>
  )
}

export default Dashboard
