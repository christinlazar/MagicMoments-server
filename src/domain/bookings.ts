// import { AcceptanceStatus } from "./vendor"

export enum PaymentStatus {
    Pending = 'pending',
    Completed = 'completed'
}

// interface bookings{
//     _id?:string,
//     clientName:string,
//     eventDate:string,
//     noOfDays:string,
//     bookingStatus:AcceptanceStatus,
//     paymentDate:Date
// }
import {Document,Types} from "mongoose"
// export enum AcceptanceStatus {
//     Requested = 'requested',
//     Accepted = 'accepted',
//     Rejected = 'rejected'
// }

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