import Admin from "../../domain/admin";
import User from "../../domain/user";
import Vendor from "../../domain/vendor";
import bookingInt from "../../domain/bookings";
interface IAdminRepository{
    findByEmail(email:string):Promise<Admin | null>;
    findUsers():Promise<User[] | null>;
    blockuser(userId:string):Promise<User|null>;
    unblockuser(userId:string):Promise<User|null>
    findVendors():Promise<Vendor[]| null>
    blockVendor(vendorId:string):Promise<Vendor | null>
    unblockVendor(vendorId:string):Promise<Vendor|null>
    acceptRequest(vendorId:string):Promise<Vendor|null>
    rejectRequest(vendorId:string):Promise<Vendor|null>
    deleteVendor(vendorId:string):Promise<Vendor | null>
    getMonthlyBooking():Promise<bookingInt[] | null | any>
    getUsersAndVendors():Promise<any | null>
    getYealyBooking():Promise<bookingInt[] | null | any>
}

export default IAdminRepository