import mongoose,{ConnectOptions} from "mongoose";
export const connectDB = async () => {
    try {

        const mongoURL ='mongodb+srv://christinlazar19:namtiCQ7NeAgDdeJ@magicmomentcluster.hca24.mongodb.net/magic-moments'
        await mongoose.connect(mongoURL)
        console.log('Connected to DB')
    } catch (error) {
        console.error(error)
    }
}