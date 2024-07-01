import Vendor from "../domain/vendor";
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
                {expiresIn:'6m'}
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
            if(!decodedToken){
                return {success:false,message:'otp has been expired'}
            }else{
                const hashedPassword = await this.hashPassword.createHash(decodedToken.vendorInfo.password)
                decodedToken.vendorInfo.password = hashedPassword
               const savedVendor = await this.ivendorRepository.saveVendor(decodedToken.vendorInfo)
               return {success:true,savedVendor}
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
                if(isPasswordCorrect == true && isExistingVendor.isAccepted  == 'accepted'){
                       const accessToken = await this.jwtToken.createJWT(isExistingVendor._id as string,'vendor')
                       const refreshToken = await this.jwtToken.createRefreshToken(isExistingVendor._id as string)
                       return {success:true,accessToken,refreshToken}
                }else{
                    return {success:false,message:'Admin still havent accepted the request'}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export default vendorUseCase