import { Request,Response,NextFunction } from "express";
import JWTtoken from "../utils/JWTtoken";
const jwtToken = new JWTtoken()

import vendorModel from "../database/vendorModel";

const vendorBlockingMiddleware = async (req:Request, res:Response,next:NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] as string
    const isValidToken =  jwtToken.verifyJWT(accessToken)
    if(isValidToken){
        const vendorId = isValidToken.id
        const vendor = await vendorModel.findOne({_id:vendorId})
        console.log("vendor",vendor)
        console.log("userblocked",vendor?.isBlocked)
        if(vendor && vendor.isBlocked == false){
            next()
        }else{
            return res.status(401).json({vendorBlocked:true})
        }
    }
  } catch (error) {
    console.error("User blocking middleware error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default vendorBlockingMiddleware