import { Request,Response,NextFunction } from "express";

import JWTtoken from "../utils/JWTtoken";

const jwtTOKEN = new JWTtoken()
const authenticateVendor = (req:Request,res:Response,next:NextFunction) =>{
    console.log("getting inside authenticate vendor")
    console.log("Getingggggggggggggggg herrrrrrreeeeeeeeeeeeeeeeeeeeeeeee")
    try {
        const authHeader = req.headers['authorization']
        console.log("auth header",authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        console.log("token is",token)
        if(token == null){
            return res.status(401).json({refresh:false})
        }
        const decode = jwtTOKEN.verifyJWT(token)
        
        console.log("decode isssss",decode)
        if(decode && decode.role == 'vendor'){
            next()
        }else if(decode && decode.role != 'vendor'){
            return res.status(401).json({success:false,role:decode.role})
        }else{
            console.log("getting in else")
            return res.status(401).json({success:false,role:'vendor'})
        }
    } catch (error) {
        console.log(error)
    }
}   
export default authenticateVendor;