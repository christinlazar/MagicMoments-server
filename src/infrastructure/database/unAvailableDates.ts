import mongoose,{Schema,Model} from "mongoose";
import unavailableDates from "../../domain/unAvailableDates";

const unAvailableDateSchema:Schema<unavailableDates> = new Schema({
    vendorId:{
        type:Schema.Types.ObjectId,
        ref:'Vendor',
        required:true
    },
    date:{
        type:[String],
        required:true
    }
},{timestamps:true})

const unAvailableModel : Model<unavailableDates> = mongoose.model<unavailableDates>('unAvailableDates',unAvailableDateSchema)
export  {unAvailableModel}