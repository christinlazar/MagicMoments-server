import Vendor, { AcceptanceStatus } from "../domain/vendor";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import otpGenerate from "../infrastructure/utils/otpGenerate";
import IVendorRepository from "./interface/IVendorRepository";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword";
import jwt from 'jsonwebtoken'

class vendorUseCase{
    private ivendorRepository:IVendorRepository
    private otpGenerate:otpGenerate
    private jwtToken:JWTtoken
    private sendMail:sendMail
    private hashPassword:hashPassword
    constructor(
        ivendorRepository:IVendorRepository,
        otpGenerate:otpGenerate,
        jwtToken:JWTtoken,
        sendMail:sendMail,
        hashPassword:hashPassword
    ){
    this.ivendorRepository = ivendorRepository
    this.otpGenerate = otpGenerate
    this.jwtToken = jwtToken
    this.sendMail = sendMail
    this.hashPassword = hashPassword
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
               console.log("otp is",otp)
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
            console.log("decoded",decodedToken)
          
            if(decodedToken == null ){
                return {expired:true,message:'otp has been expired'}
            }else{
                console.log(decodedToken.otp,otp)
                const realOtp = decodedToken.otp
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
            console.log("isexisting",isExistingVendor)
            if(isExistingVendor){
                let isPasswordCorrect = await this.hashPassword.compare(password,isExistingVendor.password)
                console.log("isPasswordCorrect",isPasswordCorrect)
                if(isPasswordCorrect == true && isExistingVendor.isAccepted  == AcceptanceStatus.Accepted){
                       const accessToken =  this.jwtToken.createJWT(isExistingVendor._id as string,'vendor')
                       const refreshToken =  this.jwtToken.createRefreshToken(isExistingVendor._id as string)
                       return {success:true,accessToken,refreshToken}
                }else if(isPasswordCorrect == false && isExistingVendor.isAccepted == AcceptanceStatus.Accepted){
                        return {passwordIncorrect:true,message:'Password is incorrect'}
                }else{
                    return {success:false,message:'Admin still havent accepted the request'}
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
}

export default vendorUseCase