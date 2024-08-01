
import {Document,Types} from "mongoose"

export enum RequestStatus {
    Requested = 'requested',
    Accepted = 'accepted',
    Rejected = 'rejected'
}

interface videoCallReqInterface extends Document{
    _id?:string;
    userId:Types.ObjectId,
    Request_Status:RequestStatus
}

export default videoCallReqInterface