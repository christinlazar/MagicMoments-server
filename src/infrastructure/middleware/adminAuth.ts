import { Request,Response,NextFunction } from "express";
import { Role } from "../../useCases/interface/Role";
import JWTtoken from "../utils/JWTtoken";

const jwtTOKEN = new JWTtoken()
const authenticateAdmin = (req:Request,res:Response,next:NextFunction) =>{
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null){
            return res.status(401).json({refresh:false})
        }
        const decode = jwtTOKEN.verifyJWT(token)
        if(decode && decode.role == Role.Admin ){
            next()
        }else if(decode && decode.role != Role.Admin){
            return res.status(401).json({success:false,role:decode.role})
        }else{
            return res.status(401).json({success:false,role:Role.Admin})
        }
    } catch (error) {
        console.error(error)
    }
}   
export default authenticateAdmin;