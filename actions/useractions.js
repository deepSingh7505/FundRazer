"use server"
import Razorpay from "razorpay"
import Payment from "../models/payment"
import mongoose from "mongoose"
import User from "../models/User"
import payment from "../models/payment"
import { error } from "node:console"


export const initiate = async (amount, to_username, paymentform) => {
    await mongoose.connect(process.env.MGDB)


    //Get razorpay id from database
    let deyuser = await User.findOne({username : to_username})
    const dey_id = deyuser.razorpayid
    const dey_secret = deyuser.razorpaysecret
    //create a instance || ye order ka instance bna rha hai 
    var instance = new Razorpay({ key_id: dey_id, key_secret: dey_secret })


    let options = {
        amount : Number.parseInt(amount),
        currency : "INR",
    }

    //ye order lekre success or failure return krega and 
    //success k andar id hogi order ki 
    let x = await instance.orders.create(options);

    // a payment object for pending orders in database
    await Payment.create({oid : x.id , amount :amount/100 , to_user : to_username , name : paymentform.name , message : paymentform.message})
    //jub bhi initiate ko bulaoge tho given (amount , username , paymmentform ) k liye success ya failure return krega 
    return x ;

}

export const  fetchuser  = async (username)=>{
    
    let data = await mongoose.connect(process.env.MGDB)
    let u = await User.findOne({username: username}).lean()
    if(u)
    {
        return {...u , _id : u._id.toString()};
    }

    
}

export const fetchPayment = async (username)=>{
    
        let data = await mongoose.connect(process.env.MGDB)
        let p = await Payment.find({to_user : username}).sort({amount : -1}).lean()
        return p.map(doc => ({ ...doc, _id: doc._id.toString() }))
}

export const updateprofile = async(data , oldusername)=>{
    await mongoose.connect(process.env.MGDB)
    let ndata = Object.fromEntries(data)

    //If username change krna hai tho cheak kro username phele se tho nhi hai
    if(oldusername !== ndata.username) // cheak kr rha hai ki same username hai kiya new == old ??
    {
        let u = await User.findOne({username : ndata.username}) //cheak kr rha kisi or nai username tho nhi le rhka phele se ?
        if(u)
        {
            return {error : "Username Already Taken !"} // if phelese le le rkha ho 
        }
        else{
            //also update dashboard details 
            await User.updateOne({email : ndata.email} , ndata)
            // old username and new username same nhi hai tho payment update kro
           await Payment.updateMany({to_user : oldusername} , {to_user : ndata.username})
        }
    }else{
        await User.updateOne({email : ndata.email} , ndata) // old username and new username same hai tho koi payment udpdate nhi krni
    }
  
    
}