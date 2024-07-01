import IAdminRepository from "./interface/IAdminRepository"
import hashPassword from "../infrastructure/utils/hashPassword"
import JWTtoken from "../infrastructure/utils/JWTtoken"
import acceptanceMail from "../infrastructure/utils/acceptanceMail"
import rejectingMail from "../infrastructure/utils/rejectanceMail"

class adminUseCase{
   private iAdminRepository:IAdminRepository
   private jwtToken:JWTtoken
   private acceptancemail:acceptanceMail
   private rejectingmail:rejectingMail
    constructor(
        iAdminRepository:IAdminRepository,
        jwtToken:JWTtoken,
        acceptancemail:acceptanceMail,
        rejectingmail:rejectingMail
    ){
        this.iAdminRepository = iAdminRepository
        this.jwtToken = jwtToken
        this.acceptancemail = acceptancemail
        this.rejectingmail = rejectingmail

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
            const res =  this.jwtToken.verifyRefreshToken(token)
            console.log("resssss isss",res)
            if(res != null){
                console.log("refresh token is",res)
                const userID = res.id 
                const role = 'admin'
                const token =  this.jwtToken.createJWT(userID,role)
                console.log("token is",token)
                return token
            }else if(res == null){
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findVendors(){
        try {
            const vendors = await this.iAdminRepository.findVendors()
            return {success:true,vendors}
        } catch (error) {
            console.error(error)
        }
    }

    async blockTheVendor(vendorId:string){
        try {
            const blockedVendor = await this.iAdminRepository.blockVendor(vendorId)
            if(blockedVendor){
                return blockedVendor
            }
        } catch (error) {
            
        }
    }
    async unblockTheVendor(vendorId:string){
        try {
            const ublockedVendor = await this.iAdminRepository.unblockVendor(vendorId)
            if(ublockedVendor){
                return ublockedVendor
            }
        } catch (error) {
            
        }
    }

    async acceptTheRequest(vendorId:string){
        try {
            const acceptedRequest = await this.iAdminRepository.acceptRequest(vendorId)
           if(acceptedRequest){
                this.acceptancemail.sendMail(acceptedRequest.companyName,acceptedRequest.companyEmail)
           }
            return acceptedRequest
        } catch (error) {
            console.error(error)
        }
    }

    async rejectTheRequest(vendorId:string){
        try {
            const rejectedRequest = await this.iAdminRepository.rejectRequest(vendorId)
            if(rejectedRequest){
                 this.rejectingmail.sendMail(rejectedRequest.companyName,rejectedRequest.companyEmail)
                await this.iAdminRepository.deleteVendor(vendorId)
                return {rejected:true}
            }
        } catch (error) {
            console.error(error)
        }
    }
}


export default adminUseCase