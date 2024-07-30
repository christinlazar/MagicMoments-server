import express from 'express'
import chatRespository from '../repository/chatRepository'
import chatController from '../../adaptors/chatController'
import chatCase from '../../useCases/chatUseCase'
import JWTtoken from '../utils/JWTtoken'
import authenticateUser from '../middleware/userAuth'
import authenticateVendor from '../middleware/vendorAuth'
const router = express.Router()
const respository = new chatRespository()
const jwtToken = new JWTtoken()
const ChatCase = new chatCase(respository,jwtToken)
const controller = new chatController(ChatCase)

router.post('/getvendorChat',authenticateUser,(req,res)=>controller.getVendorChat(req,res))
router.post('/sendMessage',authenticateUser,(req,res)=>controller.sendMessage(req,res))
router.post('/getChats',authenticateVendor,(req,res)=>controller.getUserChats(req,res))
router.post('/bringVendorUserChat',authenticateVendor,(req,res)=>controller.getVendorUserChat(req,res))
router.post('/sendMessageTouser',authenticateVendor,(req,res)=>controller.sendMessageToUser(req,res))

export default router




