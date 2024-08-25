
import { Request,Response,NextFunction } from "express";
import JWTtoken from "../utils/JWTtoken";
const jwtToken = new JWTtoken()
import { userModel } from "../database/userModel";
const userBlockingMiddleware = async (req:Request, res:Response,next:NextFunction) => {
  try {
    console.log("getting in user blocking middleware")
    const accessToken = req.headers.authorization?.split(' ')[1] as string
    console.log("access",accessToken)
    const isValidToken = await jwtToken.verifyJWT(accessToken)
    if(isValidToken){
        const userId = isValidToken.id
    console.log("userId",userId)

        const user = await userModel.findOne({_id:userId})
        console.log("user",user)
    console.log("userblocked",user?.isBlocked)

        if(user && user.isBlocked == false){
            next()
        }else{
            // if(req.cookies.accessToken){
            //     req.cookies.accessToken = null
            // }
            return res.json({userBlocked:true})
        }
    }
    next();
  } catch (error) {
    console.error("User blocking middleware error:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default userBlockingMiddleware
