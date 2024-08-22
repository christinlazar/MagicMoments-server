import User from "../domain/user";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import otpGenerate from "../infrastructure/utils/otpGenerate";
import IuserRepository from "./interface/IuserRepository";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword";
import IMakePayment from "./interface/IMakePayment";
import makePayment from "../infrastructure/utils/payment";

import jwt from 'jsonwebtoken'
import bookingModel from "../infrastructure/database/booking";
class userUsecase{
    private  iuserRepository:IuserRepository;
    private otpGenerate:otpGenerate
    private JWTtoken:JWTtoken
    private sendMail:sendMail
    private hashpassword:hashPassword
    private makePayment:IMakePayment
    private reminderMail:any
    private passPort:any
    constructor(
        iuserRepository:IuserRepository,
        otpGenerate:otpGenerate,
        JWTtoken:JWTtoken,
        sendMail:sendMail,
        hashPassword:hashPassword,
        makepayment:makePayment,
        remindermail:any,

    ){
        this.iuserRepository = iuserRepository 
        this.otpGenerate = otpGenerate
        this.JWTtoken = JWTtoken
        this.sendMail = sendMail
        this.hashpassword = hashPassword
        this.makePayment = makepayment
        this.reminderMail = remindermail
    }

    async findUser(userInfo:User){
        try {
            const userFound = await this.iuserRepository.findByEmail(userInfo.email,userInfo.phone);
            if(userFound){
                return{
                    status:200,
                    data:{
                        data:true,
                        userFound
                    }
                }
            }else{
                const otp = await this.otpGenerate.generateOtp(4);
                const otpExpiresAt:number =  Date.now()
                
                let token = jwt.sign(
                    {userInfo,otp,otpExpiresAt},
                    process.env.ACCESS_TOKEN_SECRET as string ,
                    {expiresIn:'5m' }
                )
                const mail =  this.sendMail.sendMail(
                    userInfo.name,
                    userInfo.email,
                    otp
                );
                return {
                    status:200,
                    data:{
                        data:false,
                        token:token,
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async saveUser(token:string,userOtp:string){
        try {
           let decodeToken =   this.JWTtoken.verifyJWT(token)
           if(decodeToken){
         
            if(decodeToken.otp == userOtp){
                const currentTime:number = Date.now()
                const limitedTime:number = 30000
                const expirationTime:number = currentTime -  decodeToken.otpExpiresAt
                if((expirationTime < limitedTime)){
                
                    const hashedPaswword = await this.hashpassword.createHash(decodeToken.userInfo.password)
                    decodeToken.userInfo.password = hashedPaswword
                    const userSave = await this.iuserRepository.saveUser(decodeToken.userInfo)
                    if(userSave){
                         return{success:true,message:"Registered Succesfully",userSave}
                    }
                }else{
                    return{success:false,message:"Otp has been expired"}
                }
            }else{
            
                return{success:false,incorrectOtp:true,message:"Entered otp is not correct"}
            }
           }else{
            return {success:false,message:'session has been expired,please register again',goback:true}
           }
        } catch (error) {
            
        }
    }
    async userLogin(email:string,password:string){
            try {
               
                const isValidUser = await this.iuserRepository.findByEmail(email)
                if(isValidUser){
                    if(isValidUser.isBlocked != true){
                      
                        let isValidPassword = await this.hashpassword.compare(password,isValidUser.password)
                      
                        if(isValidPassword){
                       
                            const accessToken = this.JWTtoken.createJWT(isValidUser._id as string,"user")
                            const refreshToken = this.JWTtoken.createRefreshToken(isValidUser._id )
                           
                            return {success:true,accessToken,refreshToken}
                        }
                    }else{
                      
                        return {blocked:true,message:'user has been blocked'}
                    }
                }else{
                    return {success:false}
                }
            } catch (error) {
                console.log(error)
            }
    }
    async verifyRefreshToken(token:string){
        try {
            const res =  await this.JWTtoken.verifyRefreshToken(token)
       
            if(res != null){
                const userID = res.id 
                const role = "user"
                const token = await this.JWTtoken.createJWT(userID,role)
                return token
            }else if(res == null) {
                return res
            }
        } catch (error) {
            console.log(error)
        }
    }

    async verifyToResend(token:string){
        try {
            const validToken = await this.JWTtoken.verifyJWT(token)
           if(validToken){
            const otp = await this.otpGenerate.generateOtp(4)
            const sendmail = await this.sendMail.sendMail(
                validToken.userInfo.name,
                validToken.userInfo.email,
                otp
            )
            const otpExpiresAt = Date.now()
            const userInfo = validToken.userInfo
            let token = jwt.sign(
                {userInfo,otp,otpExpiresAt},
                process.env.ACCESS_TOKEN_SECRET as string ,
                {expiresIn: '5m' }
            )
            return {succes:true,token}
           }
        } catch (error) {
            console.log(error)
        }
    }

    async sendForgotmail(email:string){
        try {
            const isExistingUser = await this.iuserRepository.findByEmail(email)
            if(isExistingUser){
                const otp = await this.otpGenerate.generateOtp(4)
                 this.sendMail.sendMail(isExistingUser.name,email,otp)
                return {mailSend:true,otp}
            }else{
                return {mailSend:false}
            }
        } catch (error) {
            
        }
    }

    async verifyForgototp(realOtp:string,otp:string){
        try {
            if(realOtp === otp){
                return {success:true}
            }else{
                return {success:false}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async changepassword(newPassword:string,email:string){
        try {
         
            const hashedPassword = await this.hashpassword.createHash(newPassword)
          
            const result = await this.iuserRepository.saveHashedPassword(hashedPassword,email)
        
             return {success:true}
        } catch (error) {
            console.log(error)
        }
    }


    async getAllVendorsData(){
        try {
            const vendors = await this.iuserRepository.getVendors() 
            if(vendors != null || vendors != undefined){
                return {success:true,data:vendors}
            }
        } catch (error) {
            
        }
    }

    async getThatVendor(vendorId:string){
        try {
            const vendor = await this.iuserRepository.getVendor(vendorId)
          
            if(vendor){
                return {success:true,data:vendor}
            }else{
                return {success:false}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async isBookingAvailable(date:string,vendorId:string,totalNoOfDays:string,token:string){
        try {
            const Token = await this.JWTtoken.verifyJWT(token)
            const user = await this.iuserRepository.findUser(Token?.id)
            const result = await this.iuserRepository.checkIsAvailable(date,vendorId)
         
            if(result){
                const userId = Token?.id
                const userName = user?.name
                const createBookingRequest = await this.iuserRepository.saveBookingRequest(userId,vendorId,date,totalNoOfDays,userName)
                if(createBookingRequest != null){
                return {success:true,reqSend:true}
                }
            }else{
                return {success:false,reqSend:false}
            }
        } catch (error) {
            
        }
    }

    async isbookingAccepted(token:string,vendorId :string){
        try {
            const isValidToken =  this.JWTtoken.verifyJWT(token)
            const userId = isValidToken?.id
            const result = await this.iuserRepository.isBookingAccepted(userId,vendorId)
            if(result != null){
                return {success:true,result}
            }else{
              
                return null
            }
        } catch (error) {
            console.error(error)
        }
    }

    async isbookingExisting(token:string,vendorId:string){
        try{
         
            const isValidToken = this.JWTtoken.verifyJWT(token)
          
            const userId = isValidToken?.id
            const result = await this.iuserRepository.isBookingExisting(userId,vendorId)
         
            if(result != null){
                return {success:false}
            }
        }catch(error){
            console.log(error)
        }
    }

    async makeBookingPayment(companyName:string | undefined,vendorId:string | undefined,amount:string | undefined,bodyData:any,bookingData:any){
        try {
            const result =  await this.makePayment.makeThePayment(companyName,amount,bodyData,bookingData)
            return result
        } catch (error) {
            
        }
    }

    async confirmPayment(bookingId:string,amountPaid:string,paymentId:string){
        try {
            const result = await this.iuserRepository.confirmBooking(bookingId,amountPaid,paymentId)
            if(result == false){
                return {OtherUserBooked:true}
            }
            else if(result != null || result != undefined){
                return {success:true}
            }else{
                return {success:false}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getBookingDetials(token:string){
            try {
                const validToken = await this.JWTtoken.verifyJWT(token)
                const userId = validToken?.id
                
                const result = await this.iuserRepository.findTheBookings(userId)
               
                if(result != null ){
                    return {success:true,bookings:result}
                }
            } catch (error) {
                console.error(error)
            }
    }

    async getbookingRequests(token:string){
            try {
            const validToken = await this.JWTtoken.verifyJWT(token)
            const userId = validToken?.id
            
            const result = await this.iuserRepository.findBookingReqs(userId)
           
            if(result != null){
                return {success:true,bookingReqs:result}
            }
            } catch (error) {
                console.error(error)
            }
    }

    async cancelBookingRequests(bookingId:string){
        try {
            const result = await this.iuserRepository.cancelBookingRequest(bookingId)
            if(result != null){
                return {success:true}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getPhotos(vendorId:string){
        try {
            const result = await this.iuserRepository.getPhotos(vendorId)
            if(result != null){
                return {success:true,vendorData:result}
            }
        } catch (error) {
            
        }
    }

    async getVideos(vendorId:string){
        try {
            const result = await this.iuserRepository.getVideos(vendorId)
            if(result != null){
                return {success:true,vendorData:result}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async submitReview(review:string,rating:number | string,vendorId:string,token:string){
        try {
            const verifiedToken = this.JWTtoken.verifyJWT(token)
            if(verifiedToken){
                const userId = verifiedToken.id
                const result = await this.iuserRepository.submitreview(review,rating,vendorId,userId)
                if(result != null && result != false){
                    return {success:true,reviewData:result}
                }
                if(result == false){
                    return {allowed:false}
                }
                else{
                    return {success:false}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    async getreviews(vendorId:string){
        try {
            const result = await this.iuserRepository.getreviews(vendorId)
            if(result != null){
                return{success:true,reviews:result}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getVendorAccordingTolocation(lat:string | number,lng:string | number,searchValue:string){
            try {
                const result = await this.iuserRepository.findByCoordinates(lat,lng,searchValue)
                if(result != null){
                    return {success:true,vendors:result}
                }
            } catch (error) {
                
            }
    }

    async addToWishList(vendorId:string,token:string){
        try {
            const isValidUser = this.JWTtoken.verifyJWT(token)
            if(isValidUser){
                const userId = isValidUser.id
                const result = await this.iuserRepository.addtoWishlist(vendorId,userId)
                if(result == false){
                    return {success:false}
                }
                if(result != null && result != undefined){
                    return {success:true,user:result}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    async getUserData(token:string){
        try {
            const isValidUser = this.JWTtoken.verifyJWT(token)
            if(isValidUser){
                const userId = isValidUser.id
            const result = await this.iuserRepository.getUserData(userId)
            if(result != null){
                return {success:true,user:result}
            }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getWishlistData(token:string){
        try {
            const isvalidUser = this.JWTtoken.verifyJWT(token)
            if(isvalidUser){
                const userId = isvalidUser.id
                const result = await this.iuserRepository.getWishlist(userId)
                if(result != null){
                    return {success:true,wishlistData:result}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async removeFromWishlist(token:string,vendorId:string){
        try {
            const isValidUser = this.JWTtoken.verifyJWT(token)
            if(isValidUser){
                const userId = isValidUser.id
                const result = await this.iuserRepository.removeFromWishlist(userId,vendorId)
                if(result != null){
                    return {success:true}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async editreview(review:string,reviewId:string){
            try {
                const result = await this.iuserRepository.editReview(review,reviewId)
                if(result != null){
                    return {success:true}
                }
            } catch (error) {
                
            }
    }

    async searchByCompanyName(companyName:string){
        try {
            const result = await this.iuserRepository.searchByCompanyName(companyName)
            if(result != null){
                return {success:true,bookings:result}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async sortbydate(startDate:string,endDate:string){
        try {
            const result = await this.iuserRepository.sortbydate(startDate,endDate)
            if(result != null){
                return {success:true,bookings:result}
            }
        } catch (error) {
            
        }
    }

    async filterbyprice(criteria:string){
        try {
            const result = await this.iuserRepository.sortbyprice(criteria)
            if(result != null && result != undefined){
                return {success:true,vendors:result}
            }
        } catch (error:any) {
           console.error(error)
        }
    }

    async cancelBooking(bookingId:string){
        try {
            const booking = await bookingModel.findOne({_id:bookingId})
            const paymentId = booking?.paymentId
            const result = await this.makePayment.refund(paymentId)
            if(result){
            const result = await this.iuserRepository.cancelBooking(bookingId)
            if(result != null){
            return {success:true,cancelled:true}
            }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async googleSignup(name:string,email:string,password:string){
        try {
            const existingUser = await this.iuserRepository.findByEmail(email)
            if(existingUser){
                return {
                    status:200,
                    data:false
                }
            }else{
                const hashedPassword = await this.hashpassword.createHash(password)
                const userSave = await this.iuserRepository.saveUser({name,email,password:hashedPassword}as User)
                return {
                    status:200,
                    data:userSave
                }
            }
        } catch (error:any) {
           console.error(error)
        }
    }

}

export default userUsecase