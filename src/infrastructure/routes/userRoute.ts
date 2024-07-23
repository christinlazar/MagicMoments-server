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
const repository = new userRepository()
const otp = new otpGenerate()
const jwt = new JWTtoken()
const sendmail = new sendMail()
const hashpwd = new hashPassword()
const makepayment = new makePayment()
const router = express.Router()


const userCase = new userUsecase(repository,otp,jwt,sendmail,hashpwd,makepayment)
const controller = new userController(userCase)
router.post('/verifyMail',(req,res)=>{controller.verifyEmail(req,res)})
router.post('/verifyOtp',(req,res)=>controller.verifyOtp(req,res))
router.post('/login',(req,res)=>controller.userLogin(req,res))
router.post('/refresh-token',(req,res)=>controller.verifyRefreshToken(req,res))
router.post('/profileSubmit',authenticateUser,(req,res)=>controller.profileSubmit(req,res))
router.post('/resendOtp',(req,res)=>controller.resendOtp(req,res))
router.post('/sendForgotMail',(req,res)=>controller.forgotMail(req,res))
router.post('/verifyForgotOtp',(req,res)=>controller.verifyForgotOtp(req,res))
router.post('/changePassword',(req,res)=>controller.chnagePassword(req,res))
router.get('/getAllVendors',(req,res)=>controller.getAllVendors(req,res))
router.post('/bringVendorDetial',(req,res)=>controller.getvendor(req,res))
router.post('/stripe-payment',authenticateUser,(req,res)=>controller.makepayment(req,res))
router.post('/sendBookingRequest',(req,res)=>controller.checkIsBookingAvailable(req,res))
router.post('/isBookingAccepted',authenticateUser,(req,res)=>controller.checkIsBookingAccepted(req,res))
router.post('/isBookingExisting',authenticateUser,(req,res)=>controller.isExistingBooking(req,res))
router.get('/confirmPayment',(req,res)=>controller.verifyPayment(req,res))
router.post('/fetchBookingDetials',authenticateUser,(req,res)=>controller.getBookingDetials(req,res))
router.post('/fetchBookingRequests',authenticateUser,(req,res)=>controller.getBookingRequests(req,res))
router.post('/cancelBooking',authenticateUser,(req,res)=>controller.cancelbookingReq(req,res))
router.post('/bringPhotos',authenticateUser,(req,res)=>controller.bringPhotos(req,res))
router.post('/bringVideos',authenticateUser,(req,res)=>controller.bringVideos(req,res))


export default router