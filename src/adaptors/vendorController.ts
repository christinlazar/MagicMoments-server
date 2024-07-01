import { Request,Response } from "express";
import Vendor from "../domain/vendor";
import vendorUseCase from "../useCases/vendorUseCase";

class vendorController{
    private vendorCase : vendorUseCase
    constructor(vendorCase:vendorUseCase){
        this.vendorCase = vendorCase;
    }

    async verifyEmail(req:Request,res:Response){
        try {
            const vendorInfo = req.body
            const result = await this.vendorCase.findUser(vendorInfo)
            if(result?.data.data){
                res.status(409).json({success:false,message:'Vendor already exists'})
            }else{
                res.status(200).json({success:true,message:'otp sended successfully',token:result?.data.token})
            }
        } catch (error) {
            console.log(error)
        }
    }

    async verifyVendorOtp(req:Request,res:Response){
        try {
            const {otp} = req.body
            console.log(req.headers)
            let token = req.headers.authorization?.split(' ')[1] as string
            const callToSaveVendor = await this.vendorCase.saveVendor(token,otp)
            if(callToSaveVendor?.success){
                res.status(200).json({success:true})
            }else{
                res.json({session:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async verifyVendorLogin(req:Request,res:Response){
        try {
            const {email,password} = req.body
            const result = await this.vendorCase.verifyLogin(email,password)
            console.log("result in verify verndrologin",result)
            if(!result?.success){
                console.log("ivde ethind pedikanda")
                res.status(401).json({success:false,message:result?.message,accepted:false})
            }else if(result.success){
                const refreshToken = result.refreshToken
                const accessToken = result.accessToken
                res.cookie('refreshToken',refreshToken,{httpOnly:true})
                res.status(200).json({success:true,accessToken})
            }

        } catch (error) {
            console.error(error)
        }
    }
    
}

export default vendorController