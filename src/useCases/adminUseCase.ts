import IAdminRepository from "./interface/IAdminRepository"
import hashPassword from "../infrastructure/utils/hashPassword"
import JWTtoken from "../infrastructure/utils/JWTtoken"

class adminUseCase{
   private iAdminRepository:IAdminRepository
   private jwtToken:JWTtoken
    constructor(
        iAdminRepository:IAdminRepository,
        jwtToken:JWTtoken
    ){
        this.iAdminRepository = iAdminRepository
        this.jwtToken = jwtToken
    }

    async adminLogin(email:string,password:string){
        try {
            const adminData = await this.iAdminRepository.findByEmail(email)
           if(adminData){
            console.log(adminData)
            if(password == adminData.password){
                const accessToken = await this.jwtToken.createJWT(adminData._id as string,'admin')
                const refreshToken = await this.jwtToken.createRefreshToken(adminData._id as string)
                console.log(`accesstoken is ${accessToken} ,refreshToken is ${refreshToken}`)
               return {success:true,accessToken,refreshToken}
            }else{
                return {success:false,message:"password doesn't matches"}
            }
           }
        } catch (error) {
            console.log(error)
        }
    }

    async findUsersFromRepo(){
        try {
            console.log("here in findUsers2")
            const users = await this.iAdminRepository.findUsers()
            console.log(users)
            if(users){
                return users
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    async blocktheuser(userId:string){
        try {
            console.log("inside block the user in usecase")
            const res = await this.iAdminRepository.blockuser(userId)
            if(res){
                return {success:true}
            }
        } catch (error) {
            console.log(error)
        }
    }

    async unBlockTheUser(userId:string){
        try {
            console.log("getting inside unblocking user")
            const res = await this.iAdminRepository.unblockuser(userId)
            if(res){
                return {success:true}
            }
        } catch (error) {
            console.log(error)
        }
    }
    async verifyRefreshToken(token:string){
        try {
            const res = await this.jwtToken.verifyRefreshToken(token)
            if(res){
                const userID = res.id 
                const role = "admin"
                const token = await this.jwtToken.createJWT(userID,role)
                console.log("token is",token)
                return token
            }else{
                return token
            }
        } catch (error) {
            console.log(error)
        }
    }
}


export default adminUseCase