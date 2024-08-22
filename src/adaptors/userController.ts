import {Request,Response} from 'express'
import User from '../domain/user'
import userUsecase from '../useCases/userUseCase'
// import Api from '../infrastructure/utils/axios'
import axios from 'axios'
import { Error } from 'mongoose'
class userController{
    private usercase:userUsecase
    constructor(usercase:userUsecase){
        this.usercase = usercase;
    }

    async verifyEmail(req:Request,res:Response){
        try {
            const userInfo = req.body;
            const email:string = userInfo.email;
            const name:string = userInfo.name;
            const phone:string = userInfo.phone;
            const password:string = userInfo.password
            const confirmPassword:string = userInfo.confirmPassword
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
            let token = req.headers.authorization?.split(" ")[1] as string;
            const userOtp:string = req.body.otp
            const saveDone = await this.usercase.saveUser(token,userOtp)

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
         
            res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge: 7 * 24 * 60 * 60 * 1000})
            res.status(200).json({accessToken,success:true})
        } catch (error) {
            console.log(error)
            }
    }
    async verifyRefreshToken(req:Request,res:Response){
    
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.json({refresh:false,role:'user'})
        }
            const accessToken = await this.usercase.verifyRefreshToken(refreshToken)
     
            if(accessToken == null){
              return res.json({refresh:false,role:'user'})
            }
            return res.status(200).json({accessToken,refresh:true})
    }
    
    async profileSubmit(req:Request,res:Response){
   
    }

    async resendOtp (req:Request,res:Response){
            try {
               
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
            console.error(error)
        }
    }

    async verifyForgotOtp(req:Request,res:Response){
        try {
            const {otp} = req.body
            const realOtp = req.cookies.forgotPasswordOtp
            const result = await this.usercase.verifyForgototp(realOtp,otp)
           res.status(200).json({success:true,verified:true})
        } catch (error) {
            
        }
    }

    async chnagePassword(req:Request,res:Response){
        try {
            const {newPassword,newPasswordConfirm} = req.body
            const email = req.cookies.email
            const result = await this.usercase.changepassword(newPassword,email)
            if(result?.success){
                res.status(200).json({success:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getAllVendors(req:Request,res:Response){
        try {
            const result = await this.usercase.getAllVendorsData()
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
          
            const result = await this.usercase.getThatVendor(vendorId)
          
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
            const {companyName,vendorId ,amount,bookingData} = req.body
            const am = parseInt(amount) * parseInt(bookingData.noOfDays)
            let advancePayment  = Math.floor(am/3)
            const advAmount = JSON.stringify(advancePayment)
            const result = await this.usercase.makeBookingPayment(companyName,vendorId,advAmount,req.body,bookingData)
            if(result){
                res.cookie('bookingId',bookingData?._id,{httpOnly:true})
                res.cookie('Amount',amount,{httpOnly:true})
                res.cookie('paymentId',result.id,{httpOnly:true})
               res.status(200).json({success:true,result,bookingData})
            }
        } catch (error) {
            
        }
    }

    async checkIsBookingAvailable(req:Request,res:Response){
        try {
            const {bookingData} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const startingDate = bookingData.date
            const totalNoOfDays = bookingData.noOfDays
            const vendorId = bookingData.vendorId
            const result = await this.usercase.isBookingAvailable(startingDate,vendorId,totalNoOfDays,token)
            if(result?.success){
                res.status(200).json({success:true,reqSend:true})    
            }else{
                res.json({success:false,reqSend:false})
            }
        } catch (error) {
            console.error(error)
        }
    }


    async checkIsBookingAccepted(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result:any = await this.usercase.isbookingAccepted(token,vendorId)
            if(result != null){
                res.status(200).json({success:true,result:result.result})
            }else{
                res.json({success:false})
            }
        } catch (error) {
            console.error(error)
        }
    }
    async isExistingBooking(req:Request,res:Response){
        try {
         
            const {vendorId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.usercase.isbookingExisting(token,vendorId)
            if(result?.success == false){
                res.status(400).json({success:false})
            }else{
                res.status(200).json({success:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async verifyPayment(req:Request,res:Response){
        try {
        
            const bookingId = req.cookies.bookingId
            const amountPaid = req.cookies.Amount
            const paymentId = req.cookies.paymentId
         
            const result = await this.usercase.confirmPayment(bookingId,amountPaid,paymentId)
            
            if(result?.success){
               res.redirect('http://localhost:3000/paymentSuccess')  
            }else if(result?.OtherUserBooked){
               res.redirect('http://localhost:3000/paymentFailed?otherUsedBooked=true')  
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getBookingDetials(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.usercase.getBookingDetials(token)
         
            if(result?.success){
                return res.status(200).json({success:true,bookings:result.bookings})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getBookingRequests(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.usercase.getbookingRequests(token)
           
            if(result?.success){
                return res.status(200).json({success:true,bookingReqs:result.bookingReqs})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async cancelbookingReq(req:Request,res:Response){
        try {
            const {bookingId} = req.body
            const result = await this.usercase.cancelBookingRequests(bookingId)
            if(result?.success){
                return res.status(200).json({success:true,cancelled:true})
            }
        } catch (error) {
            
        }
    }

    async bringPhotos(req:Request,res:Response){
    
        
        const {vendorId} = req.body
        const result = await this.usercase.getPhotos(vendorId)
        if(result?.success){
            return res.status(200).json({success:true,vendorData:result.vendorData})
        }
    }

    async bringVideos(req:Request,res:Response){
        const {vendorId} = req.body
        const result = await this.usercase.getVideos(vendorId)
        if(result?.success){
            return res.status(200).json({success:true,vendorData:result.vendorData})
        }
    }

    async submitReview(req:Request,res:Response){
        try {
            const {review,rating,vendorId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.usercase.submitReview(review,rating,vendorId,token)
            if(result?.success){
                return res.status(200).json({success:true,reviews:result.reviewData})
            }else if(result?.allowed == false){
                return res.json({isAllowed:false})
            }
            else{
                return res.json({success:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getReviews(req:Request,res:Response){
        try {
            const {vendorId} = req.body
        
            const result = await this.usercase.getreviews(vendorId)
            if(result?.success){
                return res.status(200).json({success:true,reviews:result.reviews})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getSearchCoodrinates(req:Request,res:Response){
        try {
          const {searchValue} = req.body
          if(searchValue.trim() == ''){
            return res.json({success:false})
          }
          const mykey = 'AIzaSyCdRUMgE09rO2dkbmmZR_ZVJnS1yJL8oWY'
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchValue}&key=${mykey}`)

      
          const {lat,lng} = response.data.results[0].geometry.location
          const result = await this.usercase.getVendorAccordingTolocation(lat,lng,searchValue)
          if(result?.success){
            return res.status(200).json({success:true,vendors:result.vendors})
          }
        } catch (error) {
            console.error(error)
            return res.json({success:false})
        }
    }

    async fetchplaces(req:Request,res:Response){
        try {
            
            let {place,radius} = req.body
            radius = 50000
            const response = await axios.post('https://places.googleapis.com/v1/places:autocomplete',{
            "input": place,
            "locationBias": {
              "circle": {
                "center": {
                //   "latitude":lat,
                //   "longitude": lng
                },
                "radius": 50000
              }
            }
          },{
            headers:{
                'Content-Type' : 'application/json',
                'X-Goog-Api-Key': 'AIzaSyCdRUMgE09rO2dkbmmZR_ZVJnS1yJL8oWY'
            }
          })

            const placesarr:string[] = []
            response.data.suggestions.forEach((pl:any)=>placesarr.push(pl.placePrediction.text.text))
            return res.status(200).json({success:true,places:placesarr})
        } catch (error) {
            console.error(error)
            return res.status(400).json({success:false})
        }
    }

    async addtoWishlist(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string 
            const result = await this.usercase.addToWishList(vendorId,token)
            if(result?.success == false){
                return res.json({success:false})
            }
            if(result?.success){
                return res.status(200).json({success:true,user:result.user})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getUser(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.usercase.getUserData(token)
            if(result?.success){
                return res.status(200).json({success:true,user:result.user})
            }else{
                return res.json({success:false})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getWishlistData(req:Request,res:Response){
        try {
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.usercase.getWishlistData(token)
            if(result?.success){
                return res.status(200).json({success:true,wishlist:result.wishlistData})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async removefromWishList(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.usercase.removeFromWishlist(token,vendorId)
            if(result?.success){
                return res.status(200).json({success:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async editReview(req:Request,res:Response){
        try {
            const {review,reviewId} = req.body
            const result = await this.usercase.editreview(review,reviewId)
            if(result?.success){
                return res.status(200).json({success:true})
            }
        } catch (error) {
           console.error(error) 
        }
    }

    async searchByCompany(req:Request,res:Response){
        try {
            const {companyName} = req.body
            const result = await this.usercase.searchByCompanyName(companyName)
            if(result?.success){
                return res.status(200).json({success:true,bookings:result.bookings})
            }
          
           
        } catch (error:any) {
           console.error(error)
        }
    }

    async sortbyDate(req:Request,res:Response){
        try {
            const {startDate,endDate} = req.body
            const result = await this.usercase.sortbydate(startDate,endDate)
            if(result?.success){
                return res.status(200).json({success:true,bookings:result.bookings})
            }
        } catch (error:any) {
            console.error(error.message)
        }
    }

    async filterByPrice(req:Request,res:Response){
        try {
            const {criteria} = req.body
            const result = await this.usercase.filterbyprice(criteria)
            if(result?.success){
                return res.status(200).json({success:true,vendors:result.vendors})
            }
        } catch (error:any) {
            console.error(error.message)

        }
    }

    async cancelbooking(req:Request,res:Response){
        try {
            console.log("reached in cancel server")
            const {bookingId} = req.body
            const result:any = await this.usercase.cancelBooking(bookingId)
            if(result?.cancelled){
                return res.status(200).json({success:true,cancelled:true})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async gSignUp(req:Request,res:Response){
        try {
            const {tokenResponse} = req.body
           const resultt = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{
            'Authorization':`Bearer ${tokenResponse.access_token}`
           }})
           const name = resultt.data.given_name +" "+resultt.data.family_name
           const email = resultt.data.email
           const password = '@magicmoments'
            const result = await this.usercase.googleSignup(name,email,password)
            return res.status(200).json(result)
        } catch (error) {
            console.error(error)
        }
    }

  

 
    
}
export default userController;

