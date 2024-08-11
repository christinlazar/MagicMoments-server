import mongoose, {Schema,Model} from 'mongoose'
import User from '../../domain/user'


const userSchema:Schema<User> = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    phone:{
        type:Number
    },
    wishlist:{
        type:[Schema.Types.ObjectId],
        ref:'Vendor'
    }
    
},{timestamps:true});
const userModel : Model<User> = mongoose.model<User>('User',userSchema)
export {userModel}