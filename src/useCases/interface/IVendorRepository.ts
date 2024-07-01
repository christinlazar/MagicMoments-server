import Vendor from "../../domain/vendor";

interface IVendorRepository{
    findByEmail(email:string):Promise<Vendor | null>;
    saveVendor(vendor:Vendor):Promise<Vendor | null>;
}

export default IVendorRepository