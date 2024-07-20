import {Document,Types} from "mongoose"
import { AcceptanceStatus } from "./vendor";

interface bookingInterface extends Document{
    _id?:string;
    vendorId:Types.ObjectId,
    userId:Types.ObjectId,
    userName:string,
    startingDate:string,
    noOfDays:string,
    bookingStatus:AcceptanceStatus
}

export default bookingInterface