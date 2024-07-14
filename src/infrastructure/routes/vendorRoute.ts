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
const repository = new vendorRepository()
const otp = new otpGenerate()
const jwt = new JWTtoken()
const sendmail = new sendMail()
const hashpassword = new hashPassword()
const router = express.Router()

const vendorCase = new vendorUseCase(repository,otp,jwt,sendmail,hashpassword)
const controller = new vendorController(vendorCase)

router.post('/vendorVerifyEmail',(req,res)=>controller.verifyEmail(req,res))
router.post('/vendorVerifyOtp',(req,res)=>controller.verifyVendorOtp(req,res))
router.post('/vendorLogin',(req,res)=>controller.verifyVendorLogin(req,res))
router.post('/vendorResendOtp',(req,res)=>controller.vendorresendOtp(req,res))
router.post('/refresh-token',(req,res)=>controller.verifyRefreshToken(req,res))
router.post('/addPhotos',authenticateVendor,upload.array('photos',10),(req,res)=>controller.addPhotographs(req,res))
router.post('/addVideos',authenticateVendor,upload.array('videos'),(req,res)=>controller.addVideographs(req,res))


export default router



