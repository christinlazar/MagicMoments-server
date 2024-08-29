import User from "../../domain/user";
import Vendor from "../../domain/vendor";
import bookingInterface from "../../domain/bookingRequests";
import bookingInt from "../../domain/bookings";
import reviewInterface from "../../domain/review";
import { Types } from "mongoose";
interface IuserRepository{
    findByEmail(email:string,phone?:number):Promise<User | null | any>,
    saveUser(user:User) : Promise<User | null>
    saveHashedPassword(password:string,email:string):Promise<User | null>
    getVendors():Promise <Vendor[] | null >
    getVendor(vendorId:string):Promise<Vendor | null>
    checkIsAvailable(date:string,vendorId:string ):Promise< boolean | undefined >
    saveBookingRequest(userId:string,vendorId:string,startingDate:string,noOfDays:string,userName:string | undefined) : Promise<bookingInterface | null>
    findUser(userId:string):Promise< User | null>
    isBookingAccepted(userId:string,vendorId:string):Promise<bookingInterface | null>
    isBookingExisting(userId:string,vendorId:string ):Promise<bookingInterface | null>
    confirmBooking(bookingId:string,amountPaid:string,paymentId:string):Promise<bookingInt | null | undefined | boolean>
    findTheBookings(userid:string):Promise<bookingInt[] | null>
    findBookingReqs(userid:string):Promise<bookingInterface[] | null>
    cancelBookingRequest(bookingId:string):Promise<bookingInterface | null>
    getPhotos(vendorId:string):Promise<Vendor | null>
    getVideos(vendorId:string):Promise<Vendor | null>
    submitreview(review:string,rating:number | string,vendorId:string,userId:string):Promise<reviewInterface | null | boolean>
    getreviews(vendorId:string):Promise<reviewInterface[] | null>
    findByCoordinates(lat:string | number,lng:string | number,searchValue:string):Promise<Vendor[] | null | undefined>
    addtoWishlist(vendorId:string,userId:string):Promise<User | null | undefined | boolean>
    getUserData(userId:string):Promise<User | null>
    getWishlist(userId:string):Promise<any | null>
    removeFromWishlist(userId:string,vendorId:string):Promise<User | null | undefined>
    editReview(review:string,reviewId:string):Promise<reviewInterface | null>
    searchByCompanyName(companyName:string):Promise<bookingInt[] | null>
    sortbydate(startDate:string,endDate:string):Promise<bookingInt[] | null>
    sortbyprice(criteria:string):Promise<Vendor[] | null | undefined>
    cancelBooking(bookingId:string):Promise<bookingInt | null | boolean>
}

export default IuserRepository;