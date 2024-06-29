import {Request,Response} from 'express'
import User from '../domain/user'
import userUsecase from '../useCases/userUseCase'

class userController{
    private usercase:userUsecase
    constructor(usercase:userUsecase){
        this.usercase = usercase;
    }

    async verifyEmail(req:Request,res:Response){
        try {
            console.log("Inside verifyEmail")
            console.log("req.body is",req.body)
            const userInfo = req.body;
            const email:string = userInfo.email;
            const name:string = userInfo.name;
            const phone:string = userInfo.phone;
            const password:string = userInfo.password
            const confirmPassword:string = userInfo.confirmPassword
            console.log(name,email,phone);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if(!emailRegex.test(email)){
                 return res.status(400).json({success:false,message:"Invalid email format"})
            }else if(!name.trim()){
                return res.status(200).json({success:false,message:'Name is required'})
            }else if(!password){
                return res.status(200).json({success:false,message:'password is required'})
            }else if(!confirmPassword){
                return res.status(200).json({success:false,message:'confirmPassword is required'})
            }else if(password.trim() !== confirmPassword.trim()){
                return res.status(200).json({success:false,message:"password doesn't matches" })
            }

            const userData:any = await this.usercase.findUser(userInfo as User)
            if(!userData.data.data){
                const token = userData?.data.token;
                res.status(200).json({success:true,token:token})
            }else{
                res.status(200).json({success:false,message:'User already exists'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({success:false,message:"Internal server error"})
        }
    }

    async verifyOtp(req:Request,res:Response){
        try {
            console.log("getting in verifyOtp")
            console.log("req.headers",req.headers)
            let token = req.headers.authorization?.split(" ")[1] as string;
            console.log(token)
            const userOtp:string = req.body.otp
            const saveDone = await this.usercase.saveUser(token,userOtp)
            console.log(saveDone)
            res.status(200).json(saveDone)
        } catch (error) {
            console.log(error)
        }
    }
    async userLogin(req:Request,res:Response){
        try {
            console.log("getting in userLogin")
            const {email,password} = req.body
            const isValidUser = await this.usercase.userLogin(email,password)
            if(!isValidUser?.success){
               return  res.status(401).json({success:false})
            }
            const accessToken= isValidUser?.accessToken
            const refreshToken = isValidUser?.refreshToken
            res.cookie('refreshToken',refreshToken,{httpOnly:true})
            res.status(200).json({accessToken,success:true})
        } catch (error) {
            console.log(error)
            }
    }
    async verifyRefreshToken(req:Request,res:Response){
        console.log("inside verifyrefresh in userController")
        const refreshToken = req.cookies.refreshToken;
        console.log("refreshtoken is",refreshToken)
        if(!refreshToken){
            return res.status(401).json({refresh:false})
        }
            const accessToken = await this.usercase.verifyRefreshToken(refreshToken)
            return res.status(200).json({accessToken})
    }
    async profileSubmit(req:Request,res:Response){
        console.log(req.body)
        console.log("submitteddd")
    }

    async resendOtp (req:Request,res:Response){
            try {
                console.log(req.headers)
               const token = req.headers.authorization?.split(' ')[1]
                const result = await this.usercase.verifyToResend(token as string)
                const resendedToken:string | undefined = result?.token
                res.status(200).json({success:true,resendedToken})
            } catch (error) {
                console.log(error)
            }
    }
}
export default userController;