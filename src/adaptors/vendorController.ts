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
            console.log("ivde ethyarnu")
            const vendorInfo = req.body
            const result = await this.vendorCase.findUser(vendorInfo)
            if(result?.data.data){
                console.log("usere kityarn");
                
                res.json({success:false,message:'Vendor already exists',vendorExists:true})
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
                res.json({success:true})
            }else if(callToSaveVendor?.success == false){
                res.json({success:false,otp:false})
            }
            else if(callToSaveVendor?.expired){
                res.json({expired:true})
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
            if(!result?.success && !result?.passwordIncorrect){
                console.log("ivde ethind pedikanda")
                res.json({success:false,message:result?.message,accepted:false})
            }else if(result.passwordIncorrect){
                res.json({passwordIncorrect:true})
            }  else if(result.success){
                const refreshToken = result.refreshToken
                const accessToken = result.accessToken
                res.cookie('refreshToken',refreshToken,{httpOnly:true})
                res.status(200).json({success:true,accessToken})
            }

        } catch (error) {
            console.error(error)
        }
    }

    async vendorresendOtp (req:Request,res:Response){
        try {
            console.log(req.headers)
           const token = req.headers.authorization?.split(' ')[1]
            const result = await this.vendorCase.vendorVerifyToResend(token as string)
            const resendedToken:string | undefined = result?.token
            console.log(resendedToken)
            if(result?.expired){
                return res.json({success:false,expired:true})
            }
            res.status(200).json({success:true,token:resendedToken})
        } catch (error) {
            console.log(error)
        }
}
    
}

export default vendorController