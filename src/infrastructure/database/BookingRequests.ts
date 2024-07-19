import mongoose,{Schema,Model} from "mongoose";
import bookingInterface from "../../domain/bookingRequests";

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
        startingDate:{
            type:String,
            required:true
        },
        noOfDays:{
            type:String,
            required:true
        }
},{timestamps:true})

const bookingRequestModel : Model<bookingInterface> = mongoose.model<bookingInterface>('bookingRequestModel',bookingRequestSchema)
export  {bookingRequestModel}