import mongoose,{Schema,Model} from "mongoose";
import videoCallReqInterface from "../../domain/videoCallRequest";
import { RequestStatus } from "../../domain/videoCallRequest";

const videoCallReqSchema:Schema<videoCallReqInterface> = new Schema({
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        Request_Status:{
            type:String,
            enum:Object.values(RequestStatus),
            default:RequestStatus.Requested
        }
},{timestamps:true})

const videoCallRequestModel:Model<videoCallReqInterface> = mongoose.model<videoCallReqInterface>('videoCallRequest',videoCallReqSchema)
export default videoCallRequestModel