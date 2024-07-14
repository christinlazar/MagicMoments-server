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
}

export default vendorRepository