import Vendor, { AcceptanceStatus } from "../domain/vendor";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import otpGenerate from "../infrastructure/utils/otpGenerate";
import IVendorRepository from "./interface/IVendorRepository";
import sendMail from "../infrastructure/utils/sendMail";
import bookingAcceptanceMail from "../infrastructure/utils/bookingAcceptanceMail";
import hashPassword from "../infrastructure/utils/hashPassword";
import jwt from 'jsonwebtoken'
import cloudinary from "../infrastructure/utils/cloudinary";
import { Express } from "express";

class vendorUseCase{
    private ivendorRepository:IVendorRepository
    private otpGenerate:otpGenerate
    private jwtToken:JWTtoken
    private sendMail:sendMail
    private hashPassword:hashPassword
    private bookingAcceptanceMail:bookingAcceptanceMail
    constructor(
        ivendorRepository:IVendorRepository,
        otpGenerate:otpGenerate,
        jwtToken:JWTtoken,
        sendMail:sendMail,
        hashPassword:hashPassword,
        bookingAcceptance:bookingAcceptanceMail
    ){
    this.ivendorRepository = ivendorRepository
    this.otpGenerate = otpGenerate
    this.jwtToken = jwtToken
    this.sendMail = sendMail
    this.hashPassword = hashPassword
    this.bookingAcceptanceMail = bookingAcceptance
    }
    async findUser(vendorInfo:Vendor){
        try {
            const VendorExists = await this.ivendorRepository.findByEmail(vendorInfo.companyEmail)
            if(VendorExists){
                return {
                    status:200,
                    data:{
                        data:true,
                        VendorExists
                    }
                }
            }else{
               const otp:string =  await this.otpGenerate.generateOtp(4)
               let token = jwt.sign(
                {vendorInfo,otp},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn:'5m'}
               )

               const mailsend = this.sendMail.sendMail(
                   vendorInfo.companyName,
                   vendorInfo.companyEmail,
                   otp
               )
               return {
                status:200,
                data:{
                    data:false,
                    token:token
                }
               }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async saveVendor(token:string,otp:string){
        try {
            let decodedToken =  this.jwtToken.verifyJWT(token)
            if(decodedToken == null ){
                return {expired:true,message:'otp has been expired'}
            }else{
                const realOtp = decodedToken.otp
                console.log("real",realOtp,"decoded",decodedToken.otp)
                if(realOtp == otp){
                    const hashedPassword = await this.hashPassword.createHash(decodedToken.vendorInfo.password)
                    decodedToken.vendorInfo.password = hashedPassword
                   const savedVendor = await this.ivendorRepository.saveVendor(decodedToken.vendorInfo)
                   return {success:true,savedVendor}
                }else{
                    return {success:false,message:'Entered otp is not correct'}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async verifyLogin(email:string,password:string){
        try {
            let isExistingVendor = await this.ivendorRepository.findByEmail(email)
           
            if(isExistingVendor){
                if(isExistingVendor.isBlocked == false){
                    let isPasswordCorrect = await this.hashPassword.compare(password,isExistingVendor.password)
                   
                    if(isPasswordCorrect == true && isExistingVendor.isAccepted  == AcceptanceStatus.Accepted){
                           const accessToken =  this.jwtToken.createJWT(isExistingVendor._id as string,'vendor')
                           const refreshToken =  this.jwtToken.createRefreshToken(isExistingVendor._id as string)
                           return {success:true,accessToken,refreshToken}
                    }else if(isPasswordCorrect == false && isExistingVendor.isAccepted == AcceptanceStatus.Accepted){
                            return {passwordIncorrect:true,message:'Password is incorrect'}
                    }else{
                        return {success:false,message:'Admin still havent accepted the request'}
                    }
                }else{
                    return {message2:"you have been blocked"}
                }
              
            }
        } catch (error) {
            console.error(error)
        }
    }

    async vendorVerifyToResend(token:string){
        try {
            const validToken = await this.jwtToken.verifyJWT(token)
           if(validToken){
            const otp = await this.otpGenerate.generateOtp(4)
            const sendmail = await this.sendMail.sendMail(
                validToken.vendorInfo.companyName,
                validToken.vendorInfo.companyEmail,
                otp
            )
            const otpExpiresAt = Date.now()
            const vendorInfo = validToken.vendorInfo
            let token = jwt.sign(
                {vendorInfo,otp,otpExpiresAt},
                process.env.ACCESS_TOKEN_SECRET as string ,
                {expiresIn: '5m' }
            )
            return {succes:true,token}
           }else{
            return {expired:true}
           }
        } catch (error) {
            console.log(error)
        }
    }


    async verifyRefreshToken(token:string){
        try {
            const res =  await this.jwtToken.verifyRefreshToken(token)
          
            if(res != null){
                const userID = res.id 
                const role = "vendor"
                const token = await this.jwtToken.createJWT(userID,role)
                return token
            }else if(res == null) {
                return res
            }
        } catch (error) {
            console.log(error)
        }
    }

    async addPhotosInDB(urls:string[],token:string){
        try {
           const decodedToken = await this.jwtToken.verifyJWT(token)
           if(!decodedToken){
            return {success:false,refresh:true}
           }
           const vendorId = decodedToken?.id
           const res = await this.ivendorRepository.savePhotos(urls,vendorId)
           return {success:true}
        } catch (error) {
            console.error(error)
        }
    }

    async addVideosInDB(videoFiles:Express.Multer.File[],token:string){
        try {
            
            const decoded = await this.jwtToken.verifyJWT(token)
            if(decoded == null){
                return
            }
            const vendorId = decoded.id
            const uploadVideos = videoFiles.map((file)=>
                cloudinary.uploader.upload(file.path,{
                    resource_type:'video',
                    chunk_size: 6000000,
                    max_bytes: 1000000000 
                })
            )
            const results = await Promise.all(uploadVideos);
            const videoUrls =  results.map((result)=> result.secure_url)
            const res = await this.ivendorRepository.saveVideos(videoUrls,vendorId)
            if(res != null){
                return {success:true}
            }
            return res
        } catch (error) {
            console.error(error)
        }
    }

    async addCompanyInfo(token:string,formData:any){
        try {
            const verifiedToken = await this.jwtToken.verifyJWT(token)
            if(verifiedToken !== null){
                const vendorId = verifiedToken.id;
                const addedDetails = await this.ivendorRepository.saveCompanyInfo(vendorId,formData)
                if(addedDetails){
                    return {success:true} 
                }
            }else{
                return {success:false}
            }
        } catch (error) {
            
        }
    }

    async editCompanydetails(token:string,formData:any){
        try {
            const verifiedToken = this.jwtToken.verifyJWT(token)
            if(verifiedToken != null){
                const vendorId = verifiedToken.id;
                const result = await this.ivendorRepository.editCompanyInfo(vendorId,formData)
                if(result != null){
                    return {success:true}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async toGetVendorData(token:string){
        try {
         
            const verifiedToken =   this.jwtToken.verifyJWT(token)
           
            if(verifiedToken != null || verifiedToken != undefined){
        
                const vendorId = verifiedToken.id
                const vendorData = await this.ivendorRepository.getVendorData(vendorId)
                if(vendorData){
                    return {success:true,data:vendorData}
                }
            }
        } catch (error) {
            
        }
    }

    async getAllVendorsData(){
        try {
         
            const vendors = await this.ivendorRepository.getVendors() 
            if(vendors != null || vendors != undefined){
                return {success:true,data:vendors}
            }
        } catch (error) {
            
        }
    }

   

    async addTheDates(dates:string[],token:string){
        try {
            const isVerifiedToken = this.jwtToken.verifyJWT(token)
            if(isVerifiedToken?.id){
                const vendorId = isVerifiedToken.id
            const result = await this.ivendorRepository.addDates(dates,vendorId)
         
            if(result == false){
                return {success:false}
            }
            if(result != null || result != undefined ){
                return {success:true}
            }
            }
        } catch (error) {
            
        }
    }

    async getbookingRequests(token:string){
        try {
            const verifiedToken = await this.jwtToken.verifyJWT(token)
            if(verifiedToken){
                const vendorId = verifiedToken.id 
                const result = await this.ivendorRepository.getBookingRequests(vendorId)
                if(result){
                    return {success:true,bookingData:result}
                }
            }
          
        } catch (error) {
            console.log(error)
        }
    }

    async getbookings(token:string){
        try {
            const verifiedToken = await this.jwtToken.verifyJWT(token)
            if(verifiedToken){
                const vendorId = verifiedToken.id 
                const result = await this.ivendorRepository.getBookings(vendorId)
                if(result){
                    return {success:true,bookings:result}
                }
            }
          
        } catch (error) {
            console.log(error)
        }
    }

    async acceptRequest(bookingId:string,token:string){
        try {  
            const result = await this.ivendorRepository.acceptRequest(bookingId)
            const verifiedToken = await this.jwtToken.verifyJWT(token)
            const vendorId = verifiedToken?.id
            const userId = result?.userId
            const user = await this.ivendorRepository.findUser(userId)
            if(result != null){
               
                    this.bookingAcceptanceMail.sendMail(user?.name,user?.email)
                    return {success:true}
               
            }else{
                return {success:false}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async addVendorServices(serviceData:string[],token:string){
        try {
            const verifiedToken = await this.jwtToken.verifyJWT(token)
            if(verifiedToken?.id){
                const vendorId = verifiedToken.id
              
                const result = await this.ivendorRepository.addServices(serviceData,vendorId)
                if(result != null){
                    return {success:true}
                }else{
                    return {success:false}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async addlongitudelangitude(position:any,token:string){
        try {
            const verifiedToken = this.jwtToken.verifyJWT(token)
            if(verifiedToken){
                const vendorId = verifiedToken.id
                const result = await this.ivendorRepository.addPositions(position,vendorId)
                if(result == false){
                    return {success:false}
                }
                if(result){
                    return {success:true,result:result}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async deleteService(service:string,token:string){
        try {
            const isValidToken = this.jwtToken.verifyJWT(token)
            if(isValidToken){
                const vendorId = isValidToken.id
                const result = await this.ivendorRepository.deleteService(service,vendorId)
                if(result){
                    return {serviceDeleted:true}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async sendForgetMail(email:string){
        try {
            const result = await this.ivendorRepository.findByEmail(email)
            if(result != null){
                const otp = await this.otpGenerate.generateOtp(4)
                this.sendMail.sendMail(result.companyName,result.companyEmail,otp)
                return {success:true,otp:otp}
            }
        } catch (error) {
            console.error(error)
        }
    }

 



}

export default vendorUseCase