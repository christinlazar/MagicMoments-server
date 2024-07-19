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
            if(saveDone?.incorrectOtp){
               return res.json({incorrectOtp:true})
            }else if(saveDone?.goback){
                return res.json({expired:true})
            }
            res.status(200).json({success:true})
        } catch (error) {
            console.log(error)
        }
    }
    async userLogin(req:Request,res:Response){
        try {
            console.log("getting in userLogin")
            const {email,password} = req.body
            const isValidUser = await this.usercase.userLogin(email,password)
            if(isValidUser?.blocked){
                return res.json({blocked:true})
            }
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
            return 
        }
            const accessToken = await this.usercase.verifyRefreshToken(refreshToken)
            console.log("aaaaccessToken is",accessToken)
            if(accessToken == null){
              return res.json({refresh:false,role:'user'})
            }
            return res.status(200).json({accessToken,refresh:true})
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

    async  forgotMail(req:Request,res:Response){
        try {
            const {email} = req.body
            const result =  await  this.usercase.sendForgotmail(email)
            if(result?.mailSend){
                res.cookie('forgotPasswordOtp',result?.otp,{httpOnly:true})
                res.cookie('email',email,{httpOnly:true})
                res.status(200).json({success:true,forgotmailSend:true})
            }else{
                res.status(404).json({success:false,forgotmailSend:false})
            }
        } catch (error) {
            
        }
    }

    async verifyForgotOtp(req:Request,res:Response){
        try {
            const {otp} = req.body
            const realOtp = req.cookies.forgotPasswordOtp
            
            console.log(realOtp,"--")
            const result = await this.usercase.verifyForgototp(realOtp,otp)
           res.status(200).json({success:true,verified:true})
        } catch (error) {
            
        }
    }

    async chnagePassword(req:Request,res:Response){
        try {
            console.log("getting here.")
            console.log("reqbody is",req.body)
            const {newPassword,newPasswordConfirm} = req.body
            const email = req.cookies.email
            console.log(email,newPassword)
            const result = await this.usercase.changepassword(newPassword,email)
            if(result?.success){
                res.status(200).json({success:true})
            }
        } catch (error) {
            
        }
    }

    async getAllVendors(req:Request,res:Response){
        try {
            console.log("gettinginAllVendors")
            const result = await this.usercase.getAllVendorsData()
            console.log("result of getallvendors",result)
            if(result?.success){
                res.status(200).json({success:true,data:result.data})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getvendor(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            console.log("req.body is",req.body)
            const result = await this.usercase.getThatVendor(vendorId)
            console.log("result of action",result)
            if(result?.success){
               res.status(200).json({success:true,data:result?.data})
            }else{
                res.json({success:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async makepayment(req:Request,res:Response){
        try {
            const {companyName,vendorId , amount} = req.body
            const result = await this.usercase.makeBookingPayment(companyName,vendorId,amount,req.body)
            if(result){
               res.status(200).json({success:true,result})
            }
        } catch (error) {
            
        }
    }

    async checkIsBookingAvailable(req:Request,res:Response){
        try {
            console.log(req.body)
            const token = req.headers.authorization?.split(' ')[1] as string
            const startingDate = req.body.date
            const totalNoOfDays = req.body.noOfDays
            const vendorId = req.body.vendorId
            const result = await this.usercase.isBookingAvailable(startingDate,vendorId,totalNoOfDays,token)
            if(result?.success){
                res.status(200).json({success:true,booked:false})
                
            }else{
                res.json({success:false,booked:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    
}
export default userController;

