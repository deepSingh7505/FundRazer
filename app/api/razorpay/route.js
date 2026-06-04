import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import payment from "../../../models/payment";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import { NEXT_CACHE_IMPLICIT_TAG_ID } from "next/dist/lib/constants";
import User from "../../../models/User";

export const POST = async (req) =>{
    await mongoose.connect(process.env.MGDB)
    let body = await req.formData()
    body = Object.fromEntries(body)

    //cheak kro rp orderid hai kiya aap k database mai 
    let p = await payment.findOne({oid : body.razorpay_order_id})
    if(!p)
    {
        return NextResponse.json({success : false , message :"Order Id Not found" })
    }
     let day_user =await User.findOne({username : p.to_user})     
    const secret = day_user.razorpaysecret
    let xx = validatePaymentVerification({"order_id" : body.razorpay_order_id , "payment_id" : body.razorpay_payment_id }, body.razorpay_signature ,
        secret)

        if(xx){
            //update payment
            const updatepayment = await payment.findOneAndUpdate({oid : body.razorpay_order_id}, {done : "true"} , {new: true})
           
            
           return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PAYMENT_URL}/${updatepayment.to_user}?paymentdone=true`)
        }
        else {
            return NextResponse.json({success : false , message : " Payment Verfiaction Failed"})
        }

}