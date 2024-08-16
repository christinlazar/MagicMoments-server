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

    async  saveVendor(vendor: Vendor): Promise<Vendor | null> {
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
            console.log("urls is" ,urls)
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$push:{photos:{$each:urls}}},{new:true})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async saveVideos(urls:string[],vendorId:string):Promise<Vendor | null> {
        try {
            console.log("video urls are",urls)
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
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$set:{phoneNumber:phoneNumber,description:description,startingPrice:startingPrice}})
            console.log("vendor",vendor);
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
            console.log("vendor",vendor);
            return vendor  
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getVendorData(vendorId: string): Promise<Vendor | null> {
        try {
            console.log("get in getvendorData")
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

    async addDates(dates: string[],vendorId:string): Promise<Vendor | null | boolean> {
        try {
            console.log("dates array is",dates)
            const vendorData:any = await vendorModel.findOne({_id:vendorId})
            console.log("vend",vendorData)
            for(let i = 0;i<dates.length;i++){
                console.log(dates[i])
             for(let j = 0 ;j<vendorData?.unAvailableDates.length;j++){
                if(vendorData.unAvailableDates[j] == dates[i]){
                    console.log("in thissssssssssssss");
                    
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
            console.log("logging",bookingReqs);
            
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
            console.log("in ADDeventdate");
            console.log(vendorId)
            const [year,month,day] = eventDate.split('-')
            let newDate = `${day}/${month}/${year}`
            console.log("newDate",newDate)
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
            console.log(typeof(lat))
            console.log(typeof(lng))
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
                console.log("isExists",isExists)
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


}

export default vendorRepository