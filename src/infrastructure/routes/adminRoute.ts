import express from 'express'   
import adminRepository from '../repository/adminRepository'
import JWTtoken from '../utils/JWTtoken'
import adminUseCase from '../../useCases/adminUseCase'
import adminController from '../../adaptors/adminController'
import authenticateAdmin from '../middleware/adminAuth'
const router = express.Router()

const repository = new adminRepository()
const JWT = new JWTtoken()


const adminCase = new adminUseCase(repository,JWT)
const controller = new adminController(adminCase)
router.post('/adminLogin',(req,res)=>controller.adminLogin(req,res))
router.get('/findUsers',authenticateAdmin,(req,res)=>controller.findusers(req,res))
router.post('/blockUser',authenticateAdmin,(req,res)=>controller.blockTheUser(req,res))
router.post('/unblockUser',authenticateAdmin,(req,res)=>controller.unblockTheUser(req,res))
router.post('/refresh-token',(req,res)=>controller.verifyRefreshToken(req,res))

export default router


