
import { Request,Response,NextFunction } from "express";
import JWTtoken from "../utils/JWTtoken";
const jwtToken = new JWTtoken()
import { userModel } from "../database/userModel";

const userBlockingMiddleware = async (req:Request, res:Response,next:NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] as string
    const isValidToken =  jwtToken.verifyJWT(accessToken)
    if(isValidToken){
        const userId = isValidToken.id
        const user = await userModel.findOne({_id:userId})
        console.log("user",user)
        console.log("userblocked",user?.isBlocked)
        if(user && user.isBlocked == false){
            next()
        }else{
            return res.status(401).json({userBlocked:true})
        }
    }
  } catch (error) {
    console.error("User blocking middleware error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default userBlockingMiddleware
