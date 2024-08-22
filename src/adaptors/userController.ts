import {Request,Response} from 'express'
import User from '../domain/user'
import userUsecase from '../useCases/userUseCase'
// import Api from '../infrastructure/utils/axios'
import axios from 'axios'
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
            console.log("refreshoken",refreshToken)
            res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge: 7 * 24 * 60 * 60 * 1000})
            res.status(200).json({accessToken,success:true})
        } catch (error) {
            console.log(error)
            }
    }
    async verifyRefreshToken(req:Request,res:Response){
        console.log("Christin inside verifyrefresh in userController ")
        const refreshToken = req.cookies.refreshToken;
        console.log(req.cookies)
        console.log("refreshtoken is",refreshToken)
        if(!refreshToken){
            return res.json({refresh:false,role:'user'})
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
            console.log("res.cookie",req.cookies)
            const {companyName,vendorId ,amount,bookingData} = req.body
            console.log(parseInt(amount)/3)
            const am = parseInt(amount) * parseInt(bookingData.noOfDays)
            let advancePayment  = Math.floor(am/3)
            const advAmount = JSON.stringify(advancePayment)
            const result = await this.usercase.makeBookingPayment(companyName,vendorId,advAmount,req.body,bookingData)
            if(result){
                res.cookie('bookingId',bookingData?._id,{httpOnly:true})
                res.cookie('Amount',amount,{httpOnly:true})
               res.status(200).json({success:true,result,bookingData})
            }
        } catch (error) {
            
        }
    }

    async checkIsBookingAvailable(req:Request,res:Response){
        try {
            console.log(req.body)
            const {bookingData} = req.body
            console.log("bdata",bookingData);
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
            console.log("res.cookie",req.cookies)
            console.log("Insideeee is booking aacepetd")
            const {vendorId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result:any = await this.usercase.isbookingAccepted(token,vendorId)
            console.log("result issssssssssss",result)
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
            console.log("in existing bookinggggg")
            console.log(Date.now())
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
            console.log("gonna do confirm payment")
            const bookingId = req.cookies.bookingId
            const amountPaid = req.cookies.Amount
            console.log("That amount paid is ",amountPaid)
            console.log("bookingId is",bookingId);
            const result = await this.usercase.confirmPayment(bookingId,amountPaid)
            console.log("gert here after confirming payment")
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
            console.log(result)
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
            console.log("result of bookingreqs isss",result)
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
        console.log("reached here");
        
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
            console.log("vendorId of req.body",vendorId)
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
          console.log("sch valueeee",searchValue)
          if(searchValue.trim() == ''){
            return res.json({success:false})
          }
          const mykey = 'AIzaSyCdRUMgE09rO2dkbmmZR_ZVJnS1yJL8oWY'
          const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchValue}&key=${mykey}`)

          console.log("r",response.data.results[0].geometry.location)
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
            console.log("req.body",place,radius)
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

            console.log("response from places api is",response.data)
            const placesarr:string[] = []
            response.data.suggestions.forEach((pl:any)=>placesarr.push(pl.placePrediction.text.text))
            console.log(placesarr)
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
            
        }
    }

 
    
}
export default userController;

