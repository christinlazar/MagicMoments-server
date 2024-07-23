import bookingInt, { PaymentStatus } from "../../domain/bookings";
import mongoose, { Schema,Model } from "mongoose";

const bookingSchema:Schema<bookingInt> = new Schema({
    vendorId:{
        type:Schema.Types.ObjectId,
        ref:'Vendor',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    clientName:{
        type:String,
        required:true
    },
    startingDate:{
        type:String,
        required:true
    },
    noOfDays:{
        type:String,
        required:true
    },
    amountPaid:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:Object.values(PaymentStatus),
    }
},{timestamps:true})

const bookingModel:Model<bookingInt> = mongoose.model<bookingInt>('booking',bookingSchema)
export default bookingModel