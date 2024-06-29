import mongoose from "mongoose";
import IAdminRepository from "../../useCases/interface/IAdminRepository";
import Admin from "../../domain/admin";
import { AdminModel } from "../database/adminModel";
import User from "../../domain/user";
import { userModel } from "../database/userModel";


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
}

export default adminRepository