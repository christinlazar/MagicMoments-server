import User from "../../domain/user";
import { userModel } from "../database/userModel";
import IuserRepository from "../../useCases/interface/IuserRepository";
import Vendor from "../../domain/vendor";
import vendorModel from "../database/vendorModel";
import bookingInterface from "../../domain/bookingRequests";
import bookingModel from '../database/BookingRequests'
class userRepository implements IuserRepository{
     async findByEmail(email:string,phone:number){
        try {
            const userExists = await userModel.findOne({$or:[{email:email},{phone:phone}]});
            if(userExists){
                return userExists
            }else{
                return null
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }



     async saveUser(user: User){
        try{
            console.log("inside saveUser of mongorepositry")
            const newUser = new userModel(user)
            await newUser.save()
            return newUser
        }catch(error){
            console.log(error)
            return null
        }
    }

    async  saveHashedPassword(password: string,email:string): Promise<User | null> {
        try {
            console.log("password is",password)
            const saveHashed = await userModel.findOneAndUpdate({email:email},{$set:{password:password}})
            console.log(saveHashed)
            return saveHashed
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async  getVendors(): Promise< Vendor[] | null> {
        try {
            const vendors = await vendorModel.find({})
            console.log("vendors in repo",vendors);
            
            return vendors
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async  getVendor(vendorId: string): Promise<Vendor | null> {
        try {
            console.log("vendorId is",vendorId)
            const vendor = await vendorModel.findOne({_id:vendorId})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async checkIsAvailable(date:string,vendorId:string): Promise <boolean | undefined > {
        try {
            const vendor = await vendorModel.findOne({_id:vendorId})
            console.log("The vendor for booking is",vendor)
            console.log("The date is",date)
            const [year,month,day] = date.split('-')
            let newDate = `${day}/${month}/${year}`
            console.log(newDate)
            if(vendor){
               if(vendor.unAvailableDates.includes(newDate)){
               return false
               }else{
                return true
               }
            }
        } catch (error) {
          return undefined
        }
    }
    async findUser(userId: string): Promise<User | null> {
        try {
           const user = userModel.findOne({_id:userId}) 
           return user
        } catch (error) {
            console.error(error)
            return null
        }
    }
    
    async saveBookingRequest(userId: string, vendorId: string, startingDate: string, noOfDays: string,userName:string): Promise<bookingInterface | null> {
        try {
            console.log("Im going to save the request");
            
            const bookingData = {
                vendorId,
                userId,
                userName,
                startingDate,
                noOfDays
            }
            const bookingdata = new bookingModel(bookingData)
            await bookingdata.save()
            return bookingdata
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async  isBookingAccepted(userId: string,vendorId:string): Promise<bookingInterface | null> {
        try {
            const bookingData = await bookingModel.findOne({userId:userId,vendorId:vendorId})
            return bookingData
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async  isBookingExisting(userId:string,vendorId:string): Promise<bookingInterface | null> {
        try {
            console.log("userIDDD is",userId)
            const bookingData = await bookingModel.findOne({userId:userId,vendorId:vendorId})
            return bookingData
        } catch (error) {
            console.error(error)
            return null
        }
    }
}

export default userRepository