import express from 'express'
import vendorRepository from '../repository/vendorRepository'
import vendorUseCase from '../../useCases/vendorUseCase'
import otpGenerate from '../utils/otpGenerate'
import JWTtoken from '../utils/JWTtoken'
import vendorController from '../../adaptors/vendorController'
import sendMail from '../utils/sendMail'
import hashPassword from '../utils/hashPassword'

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


export default router



