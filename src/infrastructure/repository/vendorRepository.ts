import Vendor from '../../domain/vendor';
import IVendorRepository from '../../useCases/interface/IVendorRepository';
import vendorModel from '../database/vendorModel'; 
import bookingRequestModel from '../database/BookingRequests';
import bookingInterface from '../../domain/bookingRequests';
import User from '../../domain/user';
import { userModel } from '../database/userModel';

import { AcceptanceStatus } from '../../domain/vendor';
import { Types } from 'mongoose';
import bookingInt from '../../domain/bookings';
import bookingModel from '../database/booking';

class vendorRepository implements IVendorRepository{

    async findByEmail(email: string): Promise<Vendor | null> {
        try {
            const existingVendor = vendorModel.findOne({companyEmail:email})
            if(existingVendor){
                return existingVendor
            }else{
                return null
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async  saveVendor(vendor:Vendor): Promise<Vendor | null> {
        try {
            const newVendor = new vendorModel(vendor)
            await newVendor.save()
            return newVendor
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async  savePhotos(urls:string[],vendorId:string): Promise<Vendor | null> {
        try {
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$push:{photos:{$each:urls}}},{new:true})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async saveVideos(urls:string[],vendorId:string):Promise<Vendor | null> {
        try {
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$push:{videos:{$each:urls}}},{new:true})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

     async saveCompanyInfo(vendorId: string, formData: any): Promise<Vendor | null> {
        try {
            const {description,phoneNumber,startingPrice} = formData
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{phoneNumber:phoneNumber,description:description,startingPrice:parseInt(startingPrice)}})
            return vendor  
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async editCompanyInfo(vendorId: string, formData: any): Promise<Vendor | null> {
        try {
            const {description,phoneNumber,startingPrice} = formData
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{phoneNumber:phoneNumber,description:description,startingPrice:startingPrice}})
 
            return vendor  
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getVendorData(vendorId: string): Promise<Vendor | null> {
        try {
     
            const vendor = await vendorModel.findOne({_id:vendorId})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async  getVendors(): Promise< Vendor[] | null> {
        try {
            const vendors = await vendorModel.find({})
      
            
            return vendors
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async  getVendor(vendorId: string): Promise<Vendor | null> {
        try {
      
            const vendor = await vendorModel.findOne({_id:vendorId})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async addDates(dates: string[],vendorId:string): Promise<Vendor | null | boolean> {
        try {
         
            const vendorData:any = await vendorModel.findOne({_id:vendorId})
            for(let i = 0;i<dates.length;i++){

             for(let j = 0 ;j<vendorData?.unAvailableDates.length;j++){
                if(vendorData.unAvailableDates[j] == dates[i]){
                    
                    return false
                }
             }
            }
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$push:{unAvailableDates:{$each:dates}}},{new:true})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async  getBookingRequests(vendorId:string): Promise< bookingInterface[] | null> {
        try {
            const bookingReqs = await bookingRequestModel.find({vendorId:vendorId})    
            return bookingReqs
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getBookings(vendorId:string): Promise<bookingInt[] | null> {
        try {
            const bookings = await bookingModel.find({vendorId:vendorId})
            return bookings
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async acceptRequest(bookingId: string): Promise<bookingInterface | null> {
        try {
            const acceptedReq = await bookingRequestModel.findOneAndUpdate({_id:bookingId},{$set:{bookingStatus:AcceptanceStatus.Accepted}},{new:true})
            return acceptedReq
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async addEventDate(eventDate: string, vendorId: string): Promise<Vendor | null> {
        try {
            const [year,month,day] = eventDate.split('-')
            let newDate = `${day}/${month}/${year}`
       
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$push:{unAvailableDates:newDate}},{new:true})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async findUser(userId:Types.ObjectId | undefined): Promise<User | null> {
        try {
        const user = await userModel.findOne({_id:userId})
        return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async addServices(serviceData: string[], vendorId: string): Promise<Vendor | null> {
        try {
            const vendorData = await vendorModel.findOne({_id:vendorId})
            if(vendorData){
                for(let i = 0;i<serviceData.length;i++){
                    if(vendorData.services?.includes(serviceData[i])){
                        return null
                    }
                }
            }
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$push:{services:{$each:serviceData}}},{new:true})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async addPositions(positions: any, vendorId: string): Promise<Vendor | null | any> {
        try {
          
            const ven =  await vendorModel.findOne({_id:vendorId})
            const lat = positions.lat 
            const lng = positions.lng
            const newLocation = {
                location:{
                    type:"Point",
                    coordinates:[lat,lng]
                }
            }
            let locationArray:any = ven?.locations
            let isExists = locationArray?.find((loc:any)=>{
                if(loc.location.coordinates.includes(positions.lng) && loc.location.coordinates.includes(positions.lat)){
                    return true
                }
            })
            if(isExists){
                return false
            }
            const dataAfterAddingLocation = await vendorModel.findByIdAndUpdate({_id:vendorId},{$push:{locations:newLocation}},{new:true})
            if(dataAfterAddingLocation){
                return dataAfterAddingLocation
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async deleteService(service: string, vendorId: string): Promise<boolean | null> {
        try {
            await vendorModel.findByIdAndUpdate({_id:vendorId},{$pull:{services:service}})
            return true
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async updatePassword(password:string,email:string): Promise<boolean> {
        try {
            const upatedData = await vendorModel.findOneAndUpdate({companyEmail:email},{$set:{password:password}},{new:true})
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

  


}

export default vendorRepository