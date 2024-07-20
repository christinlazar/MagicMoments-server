import Vendor from "../../domain/vendor";
import User from '../../domain/user'
import bookingInterface from "../../domain/bookingRequests";
import { Types } from "mongoose";
interface IVendorRepository{
    findByEmail(email:string):Promise<Vendor | null>;
    saveVendor(vendor:Vendor):Promise<Vendor | null>;
    savePhotos(urls:string[],vendorId:string):Promise<Vendor | null>
    saveVideos(urls:string[],vendorId:string):Promise<Vendor | null>
    saveCompanyInfo(vendorId:string,formData:any):Promise<Vendor | null>
    getVendorData(vendorId:string):Promise<Vendor | null>
    getVendors():Promise <Vendor[] | null >
    getVendor(vendorId:string):Promise<Vendor | null>
    addDates(dates:string[],vendorId:string):Promise<Vendor | null>
    getBookingRequests(vendorId:string):Promise<bookingInterface[] | null>
    acceptRequest(bookingId:string):Promise<bookingInterface | null>
    addEventDate(eventDate:string,vendorId:string):Promise<Vendor | null>
    findUser(userId: Types.ObjectId | undefined):Promise<User | null>
}

export default IVendorRepository