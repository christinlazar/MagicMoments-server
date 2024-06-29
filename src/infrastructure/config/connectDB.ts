import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const mongoURL = 'mongodb://localhost:27017/magic-moments'
        await mongoose.connect(mongoURL)
        console.log('Connected to DB')
    } catch (error) {
        console.log(error)
    }
}