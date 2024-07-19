import {Document,Types} from "mongoose"

interface unavailableDates extends Document{
        _id?:string;
        vendorId:Types.ObjectId;
        date:string[];
}

export default unavailableDates