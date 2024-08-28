import mongoose from "mongoose";
import IAdminRepository from "../../useCases/interface/IAdminRepository";
import Admin from "../../domain/admin";
import { AdminModel } from "../database/adminModel";
import User from "../../domain/user";
import { userModel } from "../database/userModel";
import Vendor from "../../domain/vendor";
import vendorModel from "../database/vendorModel";
import { AcceptanceStatus } from "../../domain/vendor";
import bookingInt from "../../domain/bookings";
import bookingModel from "../database/booking";

class adminRepository implements IAdminRepository{
    async findByEmail(email: string):Promise<Admin | null> {
        try {
            const adminExists = await AdminModel.findOne({email:email})
            if(adminExists){
                return adminExists
            }else{
                return null
            }
        }catch (error:unknown) {
            console.error
            return null
        }
       
    }
    async findUsers(): Promise<User[] | null> {
        try {
            const  users = await userModel.find({})
            if(users){
                return users
            }else{
                return null
            }
        } catch (error:unknown) {
                console.error(error)
                return null
        }
       
    }

    async blockuser(userId:string):Promise<null | User>{
        try {
            const res = await userModel.findOneAndUpdate({_id:userId},{$set:{isBlocked:true}})
            if(res){
                return res
            }else{
                return null
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }
    
    async unblockuser(userId:string):Promise<null | User>{
        try {
            const res = await userModel.findOneAndUpdate({_id:userId},{$set:{isBlocked:false}})
            if(res){
                return res
            }else{
                return null
            }
        } catch (error:unknown) {
            console.error(error)
            return null
        }
    }
    async findVendors(): Promise<Vendor[] | null> {
        try {
            const vendors = await vendorModel.find({})
            return vendors 
        } catch (error) {
            console.error(error)
            return null
        }
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
        try {
            const unblocked = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{isBlocked:false}})
            if(unblocked){
                return unblocked
            }else{
                return null
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

     async acceptRequest(vendorId: string): Promise<Vendor | null> {
        try {
            const acceptedRequest = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{isAccepted:AcceptanceStatus.Accepted}})
            return acceptedRequest
        } catch (error) {
            console.error(error)
            return null
        }
    }

     async rejectRequest(vendorId: string): Promise<Vendor | null> {
        try {
            const rejectRequest = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{isAccepted:AcceptanceStatus.Rejected}})
            return rejectRequest
        } catch (error) {
            console.error(error)
            return null
        }
    }

     async deleteVendor(vendorId: string): Promise<Vendor | null> {
        try {
            const deletedVendor = await vendorModel.findOneAndDelete({_id:vendorId})
            return deletedVendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getMonthlyBooking(): Promise<bookingInt[] | null | any> {
        try {
            const bookingData = await bookingModel.aggregate([
                {
                    $group:{
                        _id:{$month:'$createdAt'},
                        totalBookings:{$sum:1}
                    }
                },
                {
                    $sort:{_id:1}
                }
            ])
            const reformattedBooking = bookingData.map(monthly => ({
                month:monthly._id,
                total:monthly.totalBookings
            }))
            return reformattedBooking
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getUsersAndVendors(): Promise<any | null> {
        try {
            const vendors = await vendorModel.find({})
            const users = await userModel.find({})
            const totalRevenue = await bookingModel.aggregate([
                {
                    $group:{
                        _id:null,
                        totalAmount:{$sum:{$toDouble: "$amountPaid" }}
                    }
                }
            ])
            const revenue = totalRevenue[0]?.totalAmount
            return {vendors,users,revenue}
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getYealyBooking(): Promise<bookingInt[] | null | any> {
        try {
    
            const yearlyBookingData = await bookingModel.aggregate([
                {
                    $group:{
                        _id:{$year:'$createdAt'},
                        totalBookings:{$sum:1}
                    }
                },
                {
                    $sort:{_id:1}
                }
            ]);
          
            const reformattedData = yearlyBookingData.map((yearly)=>({
                year:yearly._id,
                total:yearly.totalBookings
            }))
            if(reformattedData){
                return reformattedData
            }
        } catch (error) {
            
        }
    }

    async getBookings(): Promise<bookingInt[] | null> {
        try {
            const bookings = await bookingModel.find({}).populate('vendorId').populate('userId')
            return bookings
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async sortByDate(startDate: string,endDate:string): Promise<bookingInt[] | null> {
        try {
            const filteredBookings = await bookingModel.find({
                startingDate:{
                    $gte:startDate,
                    $lte:endDate
                }
            }).populate('vendorId').populate('userId')
            return filteredBookings
        } catch (error) {
            console.error(error)
            return null
        }
    }

}

export default adminRepository