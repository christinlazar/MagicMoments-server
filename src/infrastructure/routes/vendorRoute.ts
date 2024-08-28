import express from 'express'
import vendorRepository from '../repository/vendorRepository'
import vendorUseCase from '../../useCases/vendorUseCase'
import otpGenerate from '../utils/otpGenerate'
import JWTtoken from '../utils/JWTtoken'
import vendorController from '../../adaptors/vendorController'
import sendMail from '../utils/sendMail'
import hashPassword from '../utils/hashPassword'
import upload from '../utils/multerConfig'
import cloudinary from '../utils/cloudinary'
import authenticateVendor from '../middleware/vendorAuth'
import bookingAcceptanceMail from '../utils/bookingAcceptanceMail'
import vendorBlockingMiddleware from '../middleware/vendorBlocking'
const repository = new vendorRepository()
const otp = new otpGenerate()
const jwt = new JWTtoken()
const sendmail = new sendMail()
const hashpassword = new hashPassword()
const bookingAcceptance = new bookingAcceptanceMail()
const router = express.Router()

const vendorCase = new vendorUseCase(repository,otp,jwt,sendmail,hashpassword,bookingAcceptance)
const controller = new vendorController(vendorCase)

router.post('/vendorVerifyEmail',(req,res)=>controller.verifyEmail(req,res))
router.post('/vendorVerifyOtp',(req,res)=>controller.verifyVendorOtp(req,res))
router.post('/vendorLogin',(req,res)=>controller.verifyVendorLogin(req,res))
router.post('/vendorResendOtp',(req,res)=>controller.vendorresendOtp(req,res))
router.post('/refresh-token',(req,res)=>controller.verifyRefreshToken(req,res))
router.post('/addPhotos',authenticateVendor,vendorBlockingMiddleware,upload.array('photos',10),(req,res)=>controller.addPhotographs(req,res))
router.post('/addVideos',authenticateVendor,vendorBlockingMiddleware,upload.array('videos'),(req,res)=>controller.addVideographs(req,res))
router.post('/submitStoreDetials',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.addBasicCompanyInfo(req,res))
router.post('/editDetails',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.editCompanyDetails(req,res))
router.get('/getVendorData',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.getVendorData(req,res))
router.post('/unAvailableDates',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.addUnavailableDates(req,res))
router.get('/getBookingRequests',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.getBookingRequests(req,res))
router.post('/acceptBookingrequest',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.acceptBookingrequest(req,res))
router.get('/fetchBookings',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.getBookings(req,res))
router.post('/addServices',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.addServices(req,res))
router.post('/addLongLang',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.addLongitudeLangitude(req,res))
router.post('/deleteService',authenticateVendor,vendorBlockingMiddleware,(req,res)=>controller.deleteService(req,res))
router.post('/sendForgetMail',(req,res)=>controller.sendForgetEmail(req,res))
router.post('/verifyForgetOtp',(req,res)=>controller.verifyForgetPasswordOtp(req,res))
router.post('/changePassword',(req,res)=>controller.confirmChnagingPassword(req,res))




export default router



