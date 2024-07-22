import User from "../../domain/user";
import Vendor from "../../domain/vendor";
import bookingInterface from "../../domain/bookingRequests";
import bookingInt from "../../domain/bookings";
import { Types } from "mongoose";
interface IuserRepository{
    findByEmail(email:string,phone?:number):Promise<User | null>,
    saveUser(user:User) : Promise<User | null>
    saveHashedPassword(password:string,email:string):Promise<User | null>
    getVendors():Promise <Vendor[] | null >
    getVendor(vendorId:string):Promise<Vendor | null>
    checkIsAvailable(date:string,vendorId:string ):Promise< boolean | undefined >
    saveBookingRequest(userId:string,vendorId:string,startingDate:string,noOfDays:string,userName:string | undefined) : Promise<bookingInterface | null>
    findUser(userId:string):Promise< User | null>
    isBookingAccepted(userId:string,vendorId:string):Promise<bookingInterface | null>
    isBookingExisting(userId:string,vendorId:string ):Promise<bookingInterface | null>
    confirmBooking(bookingId:string,amountPaid:string):Promise<bookingInt | null | undefined | boolean>
    findTheBookings(userid:string):Promise<bookingInt[] | null>
    findBookingReqs(userid:string):Promise<bookingInterface[] | null>
    cancelBookingRequest(bookingId:string):Promise<bookingInterface | null>
}

export default IuserRepository;