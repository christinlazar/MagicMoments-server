import express from 'express'
import userRepository from '../repository/userRepository'
import userUsecase from '../../useCases/userUseCase'
import otpGenerate from '../utils/otpGenerate'
import JWTtoken from '../utils/JWTtoken'
import userController from '../../adaptors/userController'
import sendMail from '../utils/sendMail'
import hashPassword from '../utils/hashPassword'
import authenticateUser from '../middleware/userAuth'
import makePayment from '../utils/payment'
import reminderMail from '../utils/reminderMail'
import userBlockingMiddleware from '../middleware/userBlocking'
const repository = new userRepository()
const otp = new otpGenerate()
const jwt = new JWTtoken()
const sendmail = new sendMail()
const hashpwd = new hashPassword()
const makepayment = new makePayment()
const remindermail = new reminderMail()
const router = express.Router()


const userCase = new userUsecase(repository,otp,jwt,sendmail,hashpwd,makepayment,remindermail)
const controller = new userController(userCase)
router.post('/verifyMail',(req,res)=>{controller.verifyEmail(req,res)})
router.post('/verifyOtp',(req,res)=>controller.verifyOtp(req,res))
router.post('/login',(req,res)=>controller.userLogin(req,res))
router.post('/refresh-token',(req,res)=>controller.verifyRefreshToken(req,res))
router.post('/resendOtp',(req,res)=>controller.resendOtp(req,res))
router.post('/sendForgotMail',(req,res)=>controller.forgotMail(req,res))
router.post('/verifyForgotOtp',(req,res)=>controller.verifyForgotOtp(req,res))
router.post('/changePassword',(req,res)=>controller.chnagePassword(req,res))
router.get('/getAllVendors',(req,res)=>controller.getAllVendors(req,res))
router.post('/bringVendorDetial',(req,res)=>controller.getvendor(req,res))
router.post('/stripe-payment',authenticateUser,userBlockingMiddleware,(req,res)=>controller.makepayment(req,res))
router.post('/sendBookingRequest',authenticateUser,(req,res)=>controller.checkIsBookingAvailable(req,res))
router.post('/isBookingAccepted',authenticateUser,userBlockingMiddleware,(req,res)=>controller.checkIsBookingAccepted(req,res))
router.post('/isBookingExisting',authenticateUser,userBlockingMiddleware,(req,res)=>controller.isExistingBooking(req,res))
router.get('/confirmPayment',(req,res)=>controller.verifyPayment(req,res))
router.post('/fetchBookingDetials',authenticateUser,userBlockingMiddleware,(req,res)=>controller.getBookingDetials(req,res))
router.post('/fetchBookingRequests',authenticateUser,userBlockingMiddleware,(req,res)=>controller.getBookingRequests(req,res))
router.post('/cancelBooking',authenticateUser,userBlockingMiddleware,(req,res)=>controller.cancelbookingReq(req,res))
router.post('/bringPhotos',(req,res)=>controller.bringPhotos(req,res))
router.post('/bringVideos',(req,res)=>controller.bringVideos(req,res))
router.post('/submitReview',authenticateUser,userBlockingMiddleware,(req,res)=>controller.submitReview(req,res))
router.post('/getReviews',(req,res)=>controller.getReviews(req,res))
router.post('/searchVendor',(req,res)=>controller.getSearchCoodrinates(req,res))
router.post('/fetchplaces',(req,res)=>controller.fetchplaces(req,res))
router.post('/addtoWishlist',authenticateUser,userBlockingMiddleware,(req,res)=>controller.addtoWishlist(req,res))
router.get('/getuserData',authenticateUser,userBlockingMiddleware,(req,res)=>controller.getUser(req,res))
router.get('/wishlist',authenticateUser,userBlockingMiddleware,(req,res)=>controller.getWishlistData(req,res))
router.post('/removefromwishlist',authenticateUser,userBlockingMiddleware,(req,res)=>controller.removefromWishList(req,res))
router.post('/editReview',authenticateUser,userBlockingMiddleware,(req,res)=>controller.editReview(req,res))
router.post('/searchByCompany',authenticateUser,userBlockingMiddleware,(req,res)=>controller.searchByCompany(req,res))
router.post('/sortbydate',authenticateUser,userBlockingMiddleware,(req,res)=>controller.sortbyDate(req,res))
router.post('/filterbyprice',authenticateUser,userBlockingMiddleware,(req,res)=>controller.filterByPrice(req,res))
router.post('/bookingCancel',authenticateUser,userBlockingMiddleware,(req,res)=>controller.cancelbooking(req,res))
router.post('/gSignup',(req,res)=>controller.gSignUp(req,res))


export default router