import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
    name:{type:String , },
    email:{type:String ,required : true},
    username:{type:String , required : true },
    profilepicture:{type:String , },
    coverpicture:{type:String ,  },
    razorpayid: { type: String },
    razorpaysecret: { type: String }, 
    createdAt:{type:Date , default:Date.now},
    updateAt:{type:Date , default:Date.now},
});
export default mongoose.models.user || mongoose.model("user" , Userschema);