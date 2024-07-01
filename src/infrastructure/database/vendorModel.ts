import mongoose ,{Schema,Model} from "mongoose";
import Vendor, { AcceptanceStatus } from "../../domain/vendor";


const VendorSchema:Schema<Vendor> = new Schema({
companyName:{
    type:String,
    required:true,
},
companyEmail:{
    type:String,
    required:true
},
companyLocation:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now()
},
category:{
    type:String,
    required:true
},
isAccepted:{
    type:String,
    enum:Object.values(AcceptanceStatus),
    default:AcceptanceStatus.Requested
},
isBlocked:{
    type:Boolean,
    default:false
}
})

const vendorModel:Model<Vendor> = mongoose.model<Vendor>('Vendor',VendorSchema)
export default vendorModel
