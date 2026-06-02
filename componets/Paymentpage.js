"use client"
import React from 'react'
import Script from 'next/script'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { fetchPayment, initiate, fetchuser } from '../actions/useractions'

const Paymentpage = ({ username }) => {

    const { data: session } = useSession()
    const [profile, setprofile] = useState("banner/profile.png")
    const [currentUser, setcurrentUser] = useState({})
    const [Payments, setPayments] = useState([])
    const [paymentform, setpaymentform] = useState({
        name: "", message: "", amount: ""
    })


    useEffect(() => {
        if (session) {
            setprofile(session.user.image)
        }
    }, [session])
    useEffect(() => {
        getData()

    }, [])


    const getData = async () => {
       let u = await fetchuser(username)
        setcurrentUser(u)
        let dbpayment = await fetchPayment(username)
        setPayments(dbpayment)
        console.log(dbpayment);
        
    }

    const pay = async (amount) => {
        //get order id , ye initiate ko invoke kr rha ho given data k liye success or failure responce receive krega 
        let a = await initiate(amount, username, paymentform)
        let orderid = a.id
        var options = {

            "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. 
            "currency": "INR",
            "name": "Get Me a chai", //your business name
            "description": "Test Transaction",
            "image": "Get-Me-A-Chai-Logo.svg",
            "order_id": orderid, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": `${process.env.NEXT_PUBLIC_PAYMENT_URL}/api/razorpay`,
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Deep Singh", //your customer's name
                "email": "deepsingh7505@gmail.com",
                "contact": "+917505383706" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    const handlechange = (e) => {
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const handlepay = (e) => {
        const value = `${e}00`
        pay(parseInt(value))
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <main className='flex-1'>
                <div className='w-full relative'>
                    <img className='w-full max-h-[min(400px,50vh)]  object-fit' src="banner/cfw.jpg" alt="" />
                    <div className='border-2 border-black rounded-full absolute bottom-[-50] left-[46%]'>
                        <img width={100} height={100} className=' rounded-full' src={profile} alt="" />
                    </div>
                </div>
                <div className='info flex flex-col items-center gap-4 p-13.75 bg-[#00091D]'>

                    <div className='font-bold text-3xl'>{`${username}`} - Jules&Ben's Animated Assets
                    </div>

                    <div>Creating Animated art for VTT's
                    </div>

                    <div>25,556 members &bull; 110 posts &bull; $17,550/release</div>
                    <div className='paymet flex w-[80%] gap-4'>
                        <div className='supporters  w-1/2 bg-slate-700 p-4 rounded-xl  overflow-auto max-h-[342px]'>
                            <h1 className='font-bold text-2xl'>Supporters - </h1>
                            <ul className=' flex flex-col gap-2 mt-3 '>

                                <li className='border border-slate-500 py-2 rounded-xl px-2'>DeepSingh donated 1000$ and say "good luck"</li>
                               {Payments.map((e)=>{ 
                              return e.done?<li key={e._id} className='border border-slate-500 py-2 rounded-xl px-2'>{`${e.name} donated ${e.amount} and say "${e.message}"`}</li>:null
                               })}
                               </ul>
                        </div>
                        <div className='make payment  w-1/2 bg-slate-700 p-4 rounded-xl  flex flex-col items-center '>
                            <h1 className='font-bold text-2xl'>Your Message And Payment </h1>
                            <div className='flex flex-col  items-center justify-around w-full'>
                                <input onChange={handlechange} className='bg-white text-black w-full  py-1 px-3 focus:outline-none my-2 rounded-xl ' placeholder='Enter Your Full Name' type="text" value={paymentform.name} name="name" id="" />
                                <input onChange={handlechange} className='bg-white text-black w-full  py-1 px-3 focus:outline-none my-2 rounded-xl ' placeholder='Enter Your Message' type="text" value={paymentform.message} name="message" id="" />
                                <input onChange={handlechange} className='bg-white text-black w-full  py-1 px-3 focus:outline-none my-2 rounded-xl ' placeholder='Enter Amount' type="number" value={paymentform.amount} name="amount" id="" />
                                <button onClick={() => handlepay(paymentform.amount)} className='text-white bg-gradient-to-br cursor-pointer from-purple-600 to-blue-500 hover:bg-gradient-to-bl dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 my-3 text-center leading-5 w-full'>Pay</button>
                            </div>
                            <div className='mb-[5px] '>or</div>
                            <div className="options w-full px-1 flex justify-center gap-4 overflow-auto">
                                <button className='bg-[#3D3C41] p-3 rounded-xl cursor-pointer' onClick={() => pay(2000)}>+ 20₹</button>
                                <button className='bg-[#3D3C41] p-3 rounded-xl cursor-pointer' onClick={() => pay(5000)}>+ 50₹</button>
                                <button className='bg-[#3D3C41] p-3 rounded-xl cursor-pointer' onClick={() => pay(10000)}>+ 100₹</button>
                            </div>
                        </div>
                    </div>

                </div>

            </main>

        </>
    )
}

export default Paymentpage
