import {JwtPayload} from 'jsonwebtoken'
interface IJwttoken{
    createJWT(userID:string,role:string):string,
    verifyJWT(token:string):JwtPayload | null,
    createRefreshToken(userID:string,role:string):string,
    verifyRefreshToken(token:string):JwtPayload | null
}

export default IJwttoken