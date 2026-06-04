import React from 'react'
import Paymentpage from '../../componets/Paymentpage';
import User from '../../models/User';
import mongoose from 'mongoose';
import { notFound } from 'next/navigation';

const Username = async({ params }) => {
  const { username } = await params; 
  const cheakuser = async()=>{
 await mongoose.connect(process.env.MGDB)
 let u = await User.findOne({username : username})
 if(!u)
 {
   return notFound()
 }

}
await cheakuser()


return (
  <>  
<Paymentpage username={username}/>
 </>
)
}

export default Username
