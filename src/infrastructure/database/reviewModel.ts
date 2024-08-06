import reviewInterface from "../../domain/review";
import mongoose,{Model,Schema} from "mongoose";

const reviewSchema:Schema<reviewInterface> = new Schema({
    vendorId:{
        type:Schema.Types.ObjectId,
        ref:'Vendor'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    review:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    }
},{timestamps:true})

const reviewModel:Model<reviewInterface> = mongoose.model<reviewInterface>('Review',reviewSchema)
export default reviewModel;

