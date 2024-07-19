import Vendor from '../../domain/vendor';
import IVendorRepository from '../../useCases/interface/IVendorRepository';
import vendorModel from '../database/vendorModel';

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

    async addDates(dates: string[],vendorId:string): Promise<Vendor | null> {
        try {
            console.log("dates array is",dates)
            const vendor = await vendorModel.findOneAndUpdate({_id:vendorId},{$push:{unAvailableDates:{$each:dates}}},{new:true})
            return vendor
        } catch (error) {
            console.error(error)
            return null
        }
    }
}

export default vendorRepository