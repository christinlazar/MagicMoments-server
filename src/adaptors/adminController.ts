import adminRepository from "../infrastructure/repository/adminRepository";
import adminUseCase from "../useCases/adminUseCase";
import { Request,Response } from "express";
class adminController{
    private adminCase:adminUseCase
    constructor(adminCase:adminUseCase){
        this.adminCase = adminCase;
    }

    async adminLogin(req:Request,res:Response){
        try {
            console.log("getting in adminlogi server")
            console.log(req.headers)
            const adminInfo = req.body
           console.log(adminInfo)
           const result = await this.adminCase.adminLogin(adminInfo.email,adminInfo.password)
           if(result?.success){
            const refreshToken = result.refreshToken
            const accessToken = result.refreshToken
            res.cookie('refreshToken',refreshToken,{httpOnly:true})
            console.log("result.token",result.accessToken)
            return res.status(200).json({success:true,accessToken,message:"login successfull"})
           }else{
            return res.status(401).json({success:false,message:"You are not authorised"})
           }
        } catch (error) {
            console.log(error)
        }
    }

    async findusers(req:Request,res:Response){
            try {
                console.log("here in findUsers1")
                const result = await this.adminCase.findUsersFromRepo()
                console.log("result is",result)
                if(result!= null){
                    return res.status(200).json({success:true,userData:result})
                }
            } catch (error) {
                console.log(error)
            }
    }

    async blockTheUser(req:Request,res:Response){
        try {
            console.log("inside block the user in COntr")
            const {userId} = req.body
            const result = await this.adminCase.blocktheuser(userId)
            if(result?.success){
                res.status(200).json({success:true,message:'user has been blocked successfully'})
            }else{
                res.status(400).json({success:false,message:"something went wrong"})
            }
        } catch (error) {
            console.log(error)
        }
    }
    async unblockTheUser(req:Request,res:Response){
        try {
            console.log("inside unblock1")
            const {userId} = req.body
            const result = await this.adminCase.unBlockTheUser(userId)
            if(result?.success){
                res.status(200).json({success:true,message:'user has un-blocked successfully'})
            }else{
                res.status(400).json({success:false,message:"something went wrong"})
            }
        } catch (error) {
            console.log(error)
        }
    }

    async verifyRefreshToken(req:Request,res:Response){
        console.log("inside verifyrefresh in userController")
        const refreshToken = req.cookies.refreshToken;
        console.log("refreshtoken is",refreshToken)
        if(!refreshToken){
            console.log("its here in !refresh")
            return res.status(401)
        }
        const accessToken = await this.adminCase.verifyRefreshToken(refreshToken)
        if(accessToken !== undefined){
            console.log("Access token is",accessToken)
            return res.status(200).json({accessToken})
        }else{
            return res.status(401).json({refresh:false})
        }

    }
}

export default adminController