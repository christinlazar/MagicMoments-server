import mongoose from "mongoose";
import IAdminRepository from "../../useCases/interface/IAdminRepository";
import Admin from "../../domain/admin";
import { AdminModel } from "../database/adminModel";
import User from "../../domain/user";
import { userModel } from "../database/userModel";
import Vendor from "../../domain/vendor";
import vendorModel from "../database/vendorModel";
import { AcceptanceStatus } from "../../domain/vendor";

class adminRepository implements IAdminRepository{
    async findByEmail(email: string):Promise<Admin | null> {
        const adminExists = await AdminModel.findOne({email:email})
        if(adminExists){
            return adminExists
        }else{
            return null
        }
    }
    async findUsers(): Promise<User[] | null> {
        const  users = await userModel.find({})
        if(users){
            return users
        }else{
            return null
        }
    }

    async blockuser(userId:string):Promise<null | User>{
        console.log("going to block")
            const res = await userModel.findOneAndUpdate({_id:userId},{$set:{isBlocked:true}})
            if(res){
                console.log(res)
                return res
            }else{
                return null
            }
    }
    
    async unblockuser(userId:string):Promise<null | User>{
        console.log("going to unblock")
        const res = await userModel.findOneAndUpdate({_id:userId},{$set:{isBlocked:false}})
        if(res){
            return res
        }else{
            return null
        }
    }
    async findVendors(): Promise<Vendor[] | null> {
        const vendors = await vendorModel.find({})
        return vendors
    }

     async blockVendor(vendorId: string): Promise<Vendor | null> {
        const blocked = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{isBlocked:true}}) 
        if(blocked){
            return blocked
        }else{
            return null
        }
    }

     async unblockVendor(vendorId: string): Promise<Vendor | null> {
        const unblocked = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{isBlocked:false}})
        if(unblocked){
            return unblocked
        }else{
            return null
        }
    }

     async acceptRequest(vendorId: string): Promise<Vendor | null> {
        const acceptedRequest = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{isAccepted:AcceptanceStatus.Accepted}})
        return acceptedRequest
    }

     async rejectRequest(vendorId: string): Promise<Vendor | null> {
        const rejectRequest = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{isAccepted:AcceptanceStatus.Rejected}})
        return rejectRequest
    }

     async deleteVendor(vendorId: string): Promise<Vendor | null> {
        const deletedVendor = await vendorModel.findOneAndDelete({_id:vendorId})
        return deletedVendor
    }
}

export default adminRepository