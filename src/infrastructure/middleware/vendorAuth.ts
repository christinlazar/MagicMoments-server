import { Request,Response,NextFunction } from "express";

import JWTtoken from "../utils/JWTtoken";
import { Role } from "../../useCases/interface/Role";

const jwtTOKEN = new JWTtoken()
const authenticateVendor = (req:Request,res:Response,next:NextFunction) =>{

    try {
        const authHeader = req.headers['authorization']
      
        const token = authHeader && authHeader.split(' ')[1]
     
        if(token == null){
            return res.status(401).json({refresh:false})
        }
        const decode = jwtTOKEN.verifyJWT(token)
        if(decode && decode.role == Role.Vendor){
            next()
        }else if(decode && decode.role != Role.Vendor){
            return res.status(401).json({success:false,role:decode.role})
        }else{
            return res.status(401).json({success:false,role:Role.Vendor})
        }
    } catch (error) {
        console.error(error)
    }
}   
export default authenticateVendor;