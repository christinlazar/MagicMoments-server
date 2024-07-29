import IJwttoken from "../../useCases/interface/IJWTtoken";
import jwt ,{JwtPayload} from 'jsonwebtoken'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

class JWTtoken implements IJwttoken{
    verifyJWT(token:string): JwtPayload | null {
        try {
            console.log("inisde verifyJWT")
            const jwtKey = process.env.ACCESS_TOKEN_SECRET as string
            console.log("jwtkey =>",jwtKey)
            console.log("token =>",token)
            const decode = jwt.verify(token,jwtKey) as JwtPayload
            console.log("decode is",decode)
            return decode
        } catch (error) {
            console.log("error is",error)
            return null
        }
    }
   
    createJWT(userID: string, role: string):string {
        console.log("inside create jwt")
        const jwtKey = process.env.ACCESS_TOKEN_SECRET
        if(jwtKey){
            const token:string = jwt.sign({id:userID,role:role},jwtKey,{expiresIn:'5m'})
            return token
        }
        throw new Error('Jwt key is not defined')
    }

    createRefreshToken(userID:string | undefined):string{
        console.log("getting in createrefresh")
        const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET
        if(refreshTokenKey){
            const refreshToken:string = jwt.sign({id:userID},refreshTokenKey,{expiresIn:'7d'})
            return refreshToken;
        }
        throw new Error('Refresh token is no defined')
    }
    
    verifyRefreshToken(token:string):JwtPayload | null{
        try {
            console.log("inside verifySrefreshToken in JWT")
            const refreshToken = process.env.REFRESH_TOKEN_SECRET as string
            const decode = jwt.verify(token,refreshToken) as JwtPayload
            console.log("dedcoede in verifying is",decode)
            return decode
        } catch (error:any) {
            console.log(error.message)
            return null
        }
    }
}

export default JWTtoken