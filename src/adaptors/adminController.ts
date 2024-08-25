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
            const adminInfo = req.body
           const result = await this.adminCase.adminLogin(adminInfo.email,adminInfo.password)
           if(result?.success){
            const refreshToken = result.refreshToken
            const accessToken = result.refreshToken
            res.cookie('refreshToken',refreshToken,{httpOnly:true,secure:true,sameSite:'none'})
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
               
                const result = await this.adminCase.findUsersFromRepo()
             
                if(result!= null){
                    return res.status(200).json({success:true,userData:result})
                }
            } catch (error) {
                console.log(error)
            }
    }

    async blockTheUser(req:Request,res:Response){
        try {
        
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
    
        const refreshToken = req.cookies.refreshToken;
   
        if(!refreshToken){
    
            return res.status(401)
        }
        const accessToken = await this.adminCase.verifyRefreshToken(refreshToken)
     
        if(accessToken !== null){
           
            return res.status(200).json({accessToken,refresh:true})
        }else{
            return res.json({refresh:false,role:'admin'})
        }

    }

    async bringVendors(req:Request,res:Response){
        try {
            const result = await this.adminCase.findVendors()
            return res.status(200).send({success:true,vendors:result?.vendors})
        } catch (error:any) {
            console.error(error.message)
        }
    }

    async blockvendor(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const result = await this.adminCase.blockTheVendor(vendorId)
            res.status(200).json({success:true})
        } catch (error) {
            console.error(error)
        }
    }

    async Unblockvendor(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const result = await this.adminCase.unblockTheVendor(vendorId)
            res.status(200).json({success:true})
        } catch (error) {
            console.error(error)
        }
    }

    async acceptVendorRequest(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const result  = await this.adminCase.acceptTheRequest(vendorId)
            if(result){
                res.status(200).json({accepted:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async rejectVendorRequest(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const result = await this.adminCase.rejectTheRequest(vendorId)
            if(result?.rejected){
                res.status(200).json({rejected:true})
            }
        } catch (error:any) {
            console.error(error.message)
        }
    }

    async getMonthlyBookingData(req:Request,res:Response){
        try {
            const result = await this.adminCase.getmontlyBooking()
            if(result?.success){
                return res.status(200).json({success:true,monthlyData:result.monthlyData})
            }
        } catch (error) {
            console.error(error)
        }
    }
    async getusersVednors(req:Request,res:Response){
        try {
            const result = await this.adminCase.getUsersVendor()
            if(result?.success){
                return res.status(200).json({success:true,result:result.result})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getYearlyData(req:Request,res:Response){
        try {
            const result = await this.adminCase.getYearlybooking()
            if(result?.success){
                return res.status(200).json({success:true,yearlydata:result.yearlyData})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getBookings(req:Request,res:Response){
        try {
            const result = await this.adminCase.getbookings()
            if(result?.success){
                return res.status(200).json({success:true,bookings:result.bookings})
            }
        } catch (error:any) {
            console.error(error.message)
        }
    }

    async sortByDate(req:Request,res:Response){
        try {
            const {startDate,endDate} = req.body
            const result = await this.adminCase.sortbyDate(startDate,endDate)
            if(result?.success){
                return res.status(200).json({success:true,bookings:result.filteredBookings})
            }
        } catch (error:any) {
            console.error(error.message)
        }
    }
}

export default adminController