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
                res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge: 7 * 24 * 60 * 60 * 1000})
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

    async verifyRefreshToken(req:Request,res:Response){
        console.log("inside verifyrefresh in vendorController")
        const refreshToken = req.cookies.refreshToken;
        console.log("refreshtoken of vendor is",refreshToken)
        if(!refreshToken){
            return res.json({refresh:false,role:'vendor'})
        }
            const vendorAccessToken = await this.vendorCase.verifyRefreshToken(refreshToken)
            if(vendorAccessToken == null){
                return {refresh:false,role:'vendor'}
            }
            console.log("aaaaccessToken of vendor is",vendorAccessToken)
            if(vendorAccessToken == null){
              return res.json({refresh:false,role:'vendor'})
            }
            return res.status(200).json({vendorAccessToken,refresh:true})
    }

    async addPhotographs (req:Request,res:Response){
        try {
            console.log("getting in backend")
          if(!req.files){
            return res.json({success:false,message:'No files to upload'})
          }
          let token = req.headers.authorization?.split(' ')[1] as string
          const urls = (req.files as unknown as Express.Multer.File[]).map((file:any)=>file.path)
          console.log("token is",token)
          console.log(urls)
          const result = await this.vendorCase.addPhotosInDB(urls,token)
          if(result?.success){
                return res.status(200).json({success:true,pushed:true})
          }
        //   else if(result?.success == false && result.refresh){
        //         return res.status(401).json({success:false,role:'vendor'})
        //   }
          else{
            return res.json({success:false,pushed:false})
          }
        } catch (error) {
            console.error(error)
        }
    }

    async addVideographs(req:Request,res:Response){
        try {
            console.log("reached backed to save videographs")
            console.log("req.files is",req.files)
            const token = req.headers.authorization?.split(' ')[1] as string
            const videoFiles = req.files as unknown as Express.Multer.File[];
            const result = await this.vendorCase.addVideosInDB(videoFiles,token)
            console.log(result)
            if(result?.success){
                return res.status(200).json({success:true,pushed:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async addBasicCompanyInfo(req:Request,res:Response){
        try {
            const {description,phoneNumber,startingPrice} = req.body
            const formData = {
                description:description,
                phoneNumber:phoneNumber,
                startingPrice:startingPrice
            }
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.vendorCase.addCompanyInfo(token,formData)
            console.log("result in addBasicInfo is",result)
            if(result?.success){
                res.status(200).json({success:true,added:true})
            }else{
                res.json({success:false,added:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getVendorData(req:Request,res:Response){
        try {
            console.log("In this vendordata")
            const token = req.headers.authorization?.split(' ')[1] as string
            console.log("token of vendor",token)
            const result = await this.vendorCase.toGetVendorData(token)
            console.log("result us",result)
            if(result?.success){
                res.status(200).json({success:true,data:result.data})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getAllVendors(req:Request,res:Response){
        try {
            console.log("gettinginAllVendors")
            const result = await this.vendorCase.getAllVendorsData()
            console.log("result of getallvendors",result)
            if(result?.success){
                res.status(200).json({success:true,data:result.data})
            }
        } catch (error) {
            console.error(error)
        }
    }

    // async getvendor(req:Request,res:Response){
    //     try {
    //         const {vendorId} = req.body
    //         console.log("req.body is",req.body)
    //         const result = await this.vendorCase.getThatVendor(vendorId)
    //         console.log("result of action",result)
    //         if(result?.success){
    //            res.status(200).json({success:true,data:result?.data})
    //         }else{
    //             res.json({success:false})
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    async addUnavailableDates(req:Request,res:Response){
        try {
            const {dates } = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.vendorCase.addTheDates(dates,token)
            if(result?.success){
                res.status(200).json({success:true})
            }else{
                console.log("in else");
                
                res.json({success:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getBookingRequests(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.vendorCase.getbookingRequests(token)
            console.log("result in vendContr of bookingReq",result)
            if(result?.success){
                res.status(200).json({success:true,bookingData:result.bookingData})
            }
        } catch (error) {
            
        }
    }

    async acceptBookingrequest(req:Request,res:Response){
        try {
            console.log("came in acceptance");
            const token = req.headers.authorization?.split(' ')[1] as string
            const {bookingId} = req.body
            const result = await this.vendorCase.acceptRequest(bookingId,token)
            if(result?.success){
                res.status(200).json({success:true,payNow:true})
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    
}

export default vendorController