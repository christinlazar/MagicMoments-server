import Admin from "../../domain/admin";
import User from "../../domain/user";
import Vendor from "../../domain/vendor";
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
}

export default IAdminRepository