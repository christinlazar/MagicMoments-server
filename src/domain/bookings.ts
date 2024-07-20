import { AcceptanceStatus } from "./vendor"

export enum PaymentStaus {
    Pending = 'pending',
    Completed = 'completed'

}
interface bookings{
    _id?:string,
    clientName:string,
    eventDate:string,
    noOfDays:string,
    bookingStatus:AcceptanceStatus,
    paymentDate:Date
}