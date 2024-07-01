import User from "../domain/user";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import otpGenerate from "../infrastructure/utils/otpGenerate";
import IuserRepository from "./interface/IuserRepository";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword";
import jwt from 'jsonwebtoken'
class userUsecase{
    private  iuserRepository:IuserRepository;
    private otpGenerate:otpGenerate
    private JWTtoken:JWTtoken
    private sendMail:sendMail
    private hashpassword:hashPassword
    constructor(
        iuserRepository:IuserRepository,
        otpGenerate:otpGenerate,
        JWTtoken:JWTtoken,
        sendMail:sendMail,
        hashPassword:hashPassword
    ){
        this.iuserRepository = iuserRepository 
        this.otpGenerate = otpGenerate
        this.JWTtoken = JWTtoken
        this.sendMail = sendMail
        this.hashpassword = hashPassword
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
                return{success:false,message:"Entered otp is not correct"}
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
                            const refreshToken = this.JWTtoken.createRefreshToken(isValidUser._id as string)
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
            const res = await this.JWTtoken.verifyRefreshToken(token)
            if(res){
                const userID = res.id 
                const role = "user"
                const token = await this.JWTtoken.createJWT(userID,role)
                return token
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
}

export default userUsecase