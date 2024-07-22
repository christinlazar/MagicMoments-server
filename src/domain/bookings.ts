import {Document,Types} from "mongoose"

export enum PaymentStatus {
    Pending = 'pending',
    Completed = 'completed'
}

interface bookingInt extends Document{
    _id?:string;
    vendorId:Types.ObjectId,
    userId:Types.ObjectId,
    clientName:string,
    startingDate:string,
    noOfDays:string,
    amountPaid?:string,
    paymentStatus:PaymentStatus
}

export default bookingInt