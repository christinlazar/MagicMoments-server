import { Types,Document } from "mongoose"
interface User{
    _id?:string,
    name:string,
    email:string,
    image?:string,
    password:string,
    isBlocked:boolean,
    phone:number,
    wishlist:Types.ObjectId[],
    createdAt:Date
}
export default User