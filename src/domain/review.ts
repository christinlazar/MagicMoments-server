import Types from 'mongoose'

interface reviewInterface{
    vendorId:Types.ObjectId;
    userId:Types.ObjectId;
    review:string;
    rating:number;
}

export default reviewInterface