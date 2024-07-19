import Vendor from "../../domain/vendor";

interface IVendorRepository{
    findByEmail(email:string):Promise<Vendor | null>;
    saveVendor(vendor:Vendor):Promise<Vendor | null>;
    savePhotos(urls:string[],vendorId:string):Promise<Vendor | null>
    saveVideos(urls:string[],vendorId:string):Promise<Vendor | null>
    saveCompanyInfo(vendorId:string,formData:any):Promise<Vendor | null>
    getVendorData(vendorId:string):Promise<Vendor | null>
    getVendors():Promise <Vendor[] | null >
    getVendor(vendorId:string):Promise<Vendor | null>
    addDates(dates:string[],vendorId:string):Promise<Vendor | null>
}

export default IVendorRepository