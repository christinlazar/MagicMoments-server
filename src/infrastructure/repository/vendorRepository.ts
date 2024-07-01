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
}

export default vendorRepository