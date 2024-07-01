import express from 'express'   
import adminRepository from '../repository/adminRepository'
import JWTtoken from '../utils/JWTtoken'
import adminUseCase from '../../useCases/adminUseCase'
import adminController from '../../adaptors/adminController'
import authenticateAdmin from '../middleware/adminAuth'
import acceptanceMail from '../utils/acceptanceMail'
import rejectingMail from '../utils/rejectanceMail'
const router = express.Router()

const repository = new adminRepository()
const JWT = new JWTtoken()
const acceptancemail = new acceptanceMail()
const rejectingmail = new rejectingMail()
const adminCase = new adminUseCase(repository,JWT,acceptancemail,rejectingmail)
const controller = new adminController(adminCase)
router.post('/adminLogin',(req,res)=>controller.adminLogin(req,res))
router.get('/findUsers',authenticateAdmin,(req,res)=>controller.findusers(req,res))
router.post('/blockUser',authenticateAdmin,(req,res)=>controller.blockTheUser(req,res))
router.post('/unblockUser',authenticateAdmin,(req,res)=>controller.unblockTheUser(req,res))
router.post('/refresh-token',(req,res)=>controller.verifyRefreshToken(req,res))
router.get('/bringVendors',(req,res)=>controller.bringVendors(req,res))
router.post('/blockVendor',(req,res)=>controller.blockvendor(req,res))
router.post('/unblockVendor',(req,res)=>controller.Unblockvendor(req,res))
router.post('/acceptRequest',(req,res)=>controller.acceptVendorRequest(req,res))
router.post('/rejectRequest',(req,res)=>controller.rejectVendorRequest(req,res))

export default router


