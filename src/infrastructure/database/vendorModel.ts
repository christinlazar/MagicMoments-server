import mongoose ,{Schema,Model} from "mongoose";
import Vendor from "../../domain/vendor";


const VendorSchema:Schema<Vendor> = new Schema({
companyName:{
    type:String,
    required:true,
},
contactPerson:{
    type:String,
    required:true
},
companyEmail:{
    type:String,
    required:true
},
PhoneNumber:{
    type:String,
    required:true
},
companyLocation:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now()
},
isBlocked:{
    type:Boolean,
    default:false
}
})
