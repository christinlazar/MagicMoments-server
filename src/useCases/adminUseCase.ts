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
            if(password == adminData.password){
                const accessToken = await this.jwtToken.createJWT(adminData._id as string,'admin')
                const refreshToken = await this.jwtToken.createRefreshToken(adminData._id as string)
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
            const users = await this.iAdminRepository.findUsers()
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
            if(res != null){
                const userID = res.id 
                const role = 'admin'
                const token =  this.jwtToken.createJWT(userID,role)
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

    async getmontlyBooking(){
        try {
            const result = await this.iAdminRepository.getMonthlyBooking()
            if(result != null){
                return {success:true,monthlyData:result}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getUsersVendor(){
        try {
            const result = await this.iAdminRepository.getUsersAndVendors()
            if(result != null){
                return {success:true,result:result}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getYearlybooking(){
        try {
            const result = await this.iAdminRepository.getYealyBooking()
            if(result != null){
                return {success:true,yearlyData:result}
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getbookings(){
        try {
            const result = await this.iAdminRepository.getBookings()
            if(result != null){
                return {success:true,bookings:result}
            }
        } catch (error) {
            console.error(error)
        }
    }
    async sortbyDate(startDate:string,endDate:string){
        try {
            const result = await this.iAdminRepository.sortByDate(startDate,endDate)
            if(result != null){
                return {success:true,filteredBookings:result}
            }
        } catch (error) {
            console.error(error)
        }
    }
}


export default adminUseCase