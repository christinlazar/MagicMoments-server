import User from "../../domain/user";
import Vendor from "../../domain/vendor";
import bookingInterface from "../../domain/bookingRequests";
interface IuserRepository{
    findByEmail(email:string,phone?:number):Promise<User | null>,
    saveUser(user:User) : Promise<User | null>
    saveHashedPassword(password:string,email:string):Promise<User | null>
    getVendors():Promise <Vendor[] | null >
    getVendor(vendorId:string):Promise<Vendor | null>
    checkIsAvailable(date:string,vendorId:string ):Promise< boolean | undefined >
    saveBookingRequest(userId:string,vendorId:string,startingDate:string,noOfDays:string) : Promise<bookingInterface | null>
}

export default IuserRepository;