import mongoose,{Schema,Model} from "mongoose";
import bookingInterface from "../../domain/bookingRequests";
import { AcceptanceStatus } from "../../domain/vendor";

const bookingRequestSchema:Schema<bookingInterface> = new Schema({
        vendorId:{
            type:Schema.Types.ObjectId,
            ref:'Vendor',
            required:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        userName:{
            type:String,
            required:true
        },
        startingDate:{
            type:String,
            required:true
        },
        noOfDays:{
            type:String,
            required:true
        },
        bookingStatus:{
            type:String,
            enum:Object.values(AcceptanceStatus),
            default:AcceptanceStatus.Requested
        }
},{timestamps:true})

const bookingRequestModel : Model<bookingInterface> = mongoose.model<bookingInterface>('bookingRequest',bookingRequestSchema)
export  default bookingRequestModel