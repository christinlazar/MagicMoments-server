import { Request,Response,NextFunction } from "express";

import JWTtoken from "../utils/JWTtoken";

const jwtTOKEN = new JWTtoken()
const authenticateUser = async  (req:Request,res:Response,next:NextFunction) =>{
    console.log("getting inside authenticate user")
    try {
        const authHeader = req.headers['authorization']
        console.log("auth header",authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        console.log("token is",token)
        if(token == null){
            return res.status(401).json({refresh:false})
        }
        const decode = await jwtTOKEN.verifyJWT(token)
        
        console.log("decode isssss",decode)
        if(decode){
            next()
        }else{
            console.log("getting in else")
            return res.status(401).json({success:false,role:'user'})
        }
    } catch (error) {
        console.log(error)
    }
}   
export default authenticateUser;