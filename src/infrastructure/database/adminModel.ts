import Admin from "../../domain/admin";
import mongoose, { Schema,Model } from "mongoose";

const adminSchema:Schema<Admin> = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const AdminModel:Model<Admin> = mongoose.model<Admin>('Admin',adminSchema)
export {AdminModel}