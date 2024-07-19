import {Document,Types} from "mongoose"

interface bookingInterface extends Document{
    _id?:string;
    vendorId:Types.ObjectId,
    userId:Types.ObjectId,
    startingDate:string,
    noOfDays:string,
}

export default bookingInterface