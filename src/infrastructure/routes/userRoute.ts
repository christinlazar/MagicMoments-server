import express from 'express'
import userRepository from '../repository/userRepository'
import userUsecase from '../../useCases/userUseCase'
import otpGenerate from '../utils/otpGenerate'
import JWTtoken from '../utils/JWTtoken'
import userController from '../../adaptors/userController'
import sendMail from '../utils/sendMail'
import hashPassword from '../utils/hashPassword'
import authenticateUser from '../middleware/userAuth'
const repository = new userRepository()
const otp = new otpGenerate()
const jwt = new JWTtoken()
const sendmail = new sendMail()
const hashpwd = new hashPassword()
const router = express.Router()


const userCase = new userUsecase(repository,otp,jwt,sendmail,hashpwd)
const controller = new userController(userCase)
router.post('/verifyMail',(req,res)=>{controller.verifyEmail(req,res)})
router.post('/verifyOtp',(req,res)=>controller.verifyOtp(req,res))
router.post('/login',(req,res)=>controller.userLogin(req,res))
router.post('/refresh-token',(req,res)=>controller.verifyRefreshToken(req,res))
router.post('/profileSubmit',authenticateUser,(req,res)=>controller.profileSubmit(req,res))
router.post('/resendOtp',(req,res)=>controller.resendOtp(req,res))

export default router