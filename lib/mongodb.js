import mongoose from 'mongoose'

let isConnected = false

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection")
        return
    }

    if (!process.env.MGDB) {
        throw new Error("MGDB environment variable is not defined")
    }

    try {
        await mongoose.connect(process.env.MGDB, {
            dbName: "chai",  // change to your db name
        })
        isConnected = true
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error)
        throw new Error("Failed to connect to MongoDB")
    }
}

export default connectDB