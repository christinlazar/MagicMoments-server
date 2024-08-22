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
                res.json({success:false,message:'Vendor already exists',vendorExists:true})
            }else{
                res.status(200).json({success:true,message:'otp sended successfully',token:result?.data.token})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async verifyVendorOtp(req:Request,res:Response){
        try {
            const {otp} = req.body
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
            if(result?.message2){
                return res.json({message2:result.message2})
            }
            if(!result?.success && !result?.passwordIncorrect){
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
           const token = req.headers.authorization?.split(' ')[1]
            const result = await this.vendorCase.vendorVerifyToResend(token as string)
            const resendedToken:string | undefined = result?.token
            if(result?.expired){
                return res.json({success:false,expired:true})
            }
            res.status(200).json({success:true,token:resendedToken})
        } catch (error) {
            console.error(error)
        }
    }

    async verifyRefreshToken(req:Request,res:Response){
       
        const refreshToken = req.cookies.refreshToken;
    
        if(!refreshToken){
            return res.json({refresh:false,role:'vendor'})
        }
            const vendorAccessToken = await this.vendorCase.verifyRefreshToken(refreshToken)
            if(vendorAccessToken == null){
                return {refresh:false,role:'vendor'}
            }
        
            if(vendorAccessToken == null){
              return res.json({refresh:false,role:'vendor'})
            }
            return res.status(200).json({vendorAccessToken,refresh:true})
    }

    async addPhotographs (req:Request,res:Response){
        try {
        
          if(!req.files){
            return res.json({success:false,message:'No files to upload'})
          }
          let token = req.headers.authorization?.split(' ')[1] as string
          const urls = (req.files as unknown as Express.Multer.File[]).map((file:any)=>file.path)
        
          const result = await this.vendorCase.addPhotosInDB(urls,token)
          if(result?.success){
                return res.status(200).json({success:true,pushed:true})
          }
   
          else{
            return res.json({success:false,pushed:false})
          }
        } catch (error) {
            console.error(error)
        }
    }

    async addVideographs(req:Request,res:Response){
        try {
       
            const token = req.headers.authorization?.split(' ')[1] as string
            const videoFiles = req.files as unknown as Express.Multer.File[];
            const result = await this.vendorCase.addVideosInDB(videoFiles,token)
          
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
          
            if(result?.success){
                res.status(200).json({success:true,added:true})
            }else{
                res.json({success:false,added:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async editCompanyDetails(req:Request,res:Response){
        try {
            const {formData} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.vendorCase.editCompanydetails(token,formData)
            if(result?.success){
                return res.status(200).json({success:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getVendorData(req:Request,res:Response){
        try {
          
            const token = req.headers.authorization?.split(' ')[1] as string
          
            const result = await this.vendorCase.toGetVendorData(token)
         
            if(result?.success){
                res.status(200).json({success:true,data:result.data})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getAllVendors(req:Request,res:Response){
        try {
       
            const result = await this.vendorCase.getAllVendorsData()
   
            if(result?.success){
                res.status(200).json({success:true,data:result.data})
            }
        } catch (error) {
            console.error(error)
        }
    }



    async addUnavailableDates(req:Request,res:Response){
        try {
            const {dates } = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.vendorCase.addTheDates(dates,token)
            if(result?.success){
                res.status(200).json({success:true})
            }else{                
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
            if(result?.success){
                res.status(200).json({success:true,bookingData:result.bookingData})
            }
        } catch (error) {
            
        }
    }

    async getBookings(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.vendorCase.getbookings(token)
           
            if(result?.success){
                res.status(200).json({success:true,bookings:result.bookings})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async acceptBookingrequest(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const {bookingId} = req.body
            const result = await this.vendorCase.acceptRequest(bookingId,token)
            if(result?.success){
                res.status(200).json({success:true,payNow:true})
            }
        } catch (error) {
            console.error(error);
            
        }
    }

    async addServices(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const {serviceData} = req.body
         
            const result = await this.vendorCase.addVendorServices(serviceData,token)
            if(result?.success){
                return res.status(200).json({success:true,serviceAdded:true})
            }else{
                return res.json({success:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async addLongitudeLangitude(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string 
            const {position} = req.body
        
            const result = await this.vendorCase.addlongitudelangitude(position,token)
            if(result?.success){
                return res.status(200).json({success:true,vendorData:result.result})
            }else if(result?.success == false){
                return res.json({success:false})
            }
        } catch (error) {
            console.error(error)
        }
    }
    
}

export default vendorController