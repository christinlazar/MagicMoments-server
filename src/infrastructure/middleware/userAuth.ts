import { Request,Response,NextFunction } from "express";

import JWTtoken from "../utils/JWTtoken";

const jwtTOKEN = new JWTtoken()
const authenticateUser = async  (req:Request,res:Response,next:NextFunction) =>{
    
    try {
        const authHeader = req.headers['authorization']
  
        const token = authHeader && authHeader.split(' ')[1]
   
        if(token == null){
            return res.status(401).json({refresh:false})
        }
        const decode = await jwtTOKEN.verifyJWT(token)
        
 
        if(decode && decode.role == 'user'){  
            next()
        }
        else if(decode && decode.role != 'user'){
            return res.status(401).json({success:false,role:decode.role})
        }else{
            return res.status(401).json({success:false,role:'user'})
        }
    } catch (error) {
        console.log(error)
    }
}   
export default authenticateUser;