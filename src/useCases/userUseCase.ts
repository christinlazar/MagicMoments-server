import User from "../domain/user";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import otpGenerate from "../infrastructure/utils/otpGenerate";
import IuserRepository from "./interface/IuserRepository";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword";
import IMakePayment from "./interface/IMakePayment";
import makePayment from "../infrastructure/utils/payment";
import jwt from 'jsonwebtoken'
class userUsecase{
    private  iuserRepository:IuserRepository;
    private otpGenerate:otpGenerate
    private JWTtoken:JWTtoken
    private sendMail:sendMail
    private hashpassword:hashPassword
    private makePayment:IMakePayment
    constructor(
        iuserRepository:IuserRepository,
        otpGenerate:otpGenerate,
        JWTtoken:JWTtoken,
        sendMail:sendMail,
        hashPassword:hashPassword,
        makepayment:makePayment

    ){
        this.iuserRepository = iuserRepository 
        this.otpGenerate = otpGenerate
        this.JWTtoken = JWTtoken
        this.sendMail = sendMail
        this.hashpassword = hashPassword
        this.makePayment = makepayment
    }

    async findUser(userInfo:User){
        try {
            console.log("inside findUSer")
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
                console.log(`otp is ${otp}`);
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
            console.log("getting in save user")
           let decodeToken =   this.JWTtoken.verifyJWT(token)
           console.log("decode token in saveUser in useCase",decodeToken)
           if(decodeToken){
            console.log(decodeToken.otp,userOtp)
            if(decodeToken.otp == userOtp){
                const currentTime:number = Date.now()
                console.log("currentTime",currentTime)
                console.log("expiresAT",decodeToken.otpExpiresAt)
                console.log("is",(currentTime -  decodeToken.otpExpiresAt))
                const limitedTime:number = 30000
                const expirationTime:number = currentTime -  decodeToken.otpExpiresAt
                if((expirationTime < limitedTime)){
                    console.log("just inside after calculation") 
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
                console.log("otp is not correct")
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
                console.log("getting in useCase")
                const isValidUser = await this.iuserRepository.findByEmail(email)
                if(isValidUser){
                    if(isValidUser.isBlocked != true){
                        console.log("not blocked")
                        console.log(isValidUser)
                        console.log("getting in is validuser")
                        let isValidPassword = await this.hashpassword.compare(password,isValidUser.password)
                        console.log(isValidPassword)
                        if(isValidPassword){
                        console.log("getting in is validpwd")
                            const accessToken = this.JWTtoken.createJWT(isValidUser._id as string,"user")
                            const refreshToken = this.JWTtoken.createRefreshToken(isValidUser._id )
                            console.log("refresh in userLogin is",refreshToken)
                            console.log(accessToken,refreshToken)
                            return {success:true,accessToken,refreshToken}
                        }
                    }else{
                        console.log("blocked")
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
            console.log("chhhh",res)
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
            console.log("here in new password")
            const hashedPassword = await this.hashpassword.createHash(newPassword)
            console.log(hashedPassword)
            const result = await this.iuserRepository.saveHashedPassword(hashedPassword,email)
            console.log(result)
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
            console.log("vendor",vendor)
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
            console.log("THE USER IS",user)
            console.log("The user who requested is",user)
            console.log("TOKEN IN IS BOOKING AVAILABLE",Token)
            const result = await this.iuserRepository.checkIsAvailable(date,vendorId)
            console.log("is included",result)
            if(result){
                const userId = Token?.id
                const userName = user?.name
                console.log("userName is",userName)
                console.log(userId)
                console.log(Token)
                const createBookingRequest = await this.iuserRepository.saveBookingRequest(userId,vendorId,date,totalNoOfDays,userName)
                console.log("created booking request is",createBookingRequest)
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
                console.log("result before pay is",result)
                return {success:true,result}
            }else{
                console.log("result in else",result)
                return null
            }
        } catch (error) {
            console.error(error)
        }
    }

    async isbookingExisting(token:string,vendorId:string){
        try{
            console.log("vendorId",vendorId)
            const isValidToken = this.JWTtoken.verifyJWT(token)
            console.log("isVlaidToken",isValidToken)
            const userId = isValidToken?.id
            const result = await this.iuserRepository.isBookingExisting(userId,vendorId)
            console.log("existing booking",result)
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
            console.log("result is",result)
            return result
        } catch (error) {
            
        }
    }

    async confirmPayment(bookingId:string,amountPaid:string){
        try {
            const result = await this.iuserRepository.confirmBooking(bookingId,amountPaid)
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
                console.log("userrrrrrrrr",userId)
                const result = await this.iuserRepository.findTheBookings(userId)
                console.log("bookings is",result)
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
            console.log("userrr",userId)
            const result = await this.iuserRepository.findBookingReqs(userId)
            console.log("bookingReqs",result)
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
            console.log("in get photos useCase",vendorId);
            
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
}

export default userUsecase