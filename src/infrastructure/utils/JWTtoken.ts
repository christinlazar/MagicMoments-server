import IJwttoken from "../../useCases/interface/IJWTtoken";
import jwt ,{JwtPayload} from 'jsonwebtoken'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

class JWTtoken implements IJwttoken{
    verifyJWT(token:string): JwtPayload | null {
        try {
            const jwtKey = process.env.ACCESS_TOKEN_SECRET as string
            const decode = jwt.verify(token,jwtKey) as JwtPayload
            return decode
        } catch (error) {
            // console.log("error is",error)
            return null
        }
    }
   
    createJWT(userID: string, role: string):string {

        const jwtKey = process.env.ACCESS_TOKEN_SECRET
        if(jwtKey){
            const token:string = jwt.sign({id:userID,role:role},jwtKey,{expiresIn:'5m'})
            return token
        }
        throw new Error('Jwt key is not defined')
    }

    createRefreshToken(userID:string | undefined):string{
       
        const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET
        if(refreshTokenKey){
            const refreshToken:string = jwt.sign({id:userID},refreshTokenKey,{expiresIn:'7d'})
            return refreshToken;
        }
        throw new Error('Refresh token is no defined')
    }
    
    verifyRefreshToken(token:string):JwtPayload | null{
        try {
          
            const refreshToken = process.env.REFRESH_TOKEN_SECRET as string
            const decode = jwt.verify(token,refreshToken) as JwtPayload
            return decode
        } catch (error:any) {
            console.log(error.message)
            return null
        }
    }
}

export default JWTtoken