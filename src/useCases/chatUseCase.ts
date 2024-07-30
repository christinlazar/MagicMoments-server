import messageInterface from "../domain/message";
import JWTtoken from "../infrastructure/utils/JWTtoken";
import chatRespository from "../infrastructure/repository/chatRepository";
import IchatRepository from "./interface/IChatRepository";
import IJwttoken from "./interface/IJWTtoken";
class chatCase{
    private chatRepo:IchatRepository
    private jwtToken:IJwttoken
    constructor(
        chatrepository:IchatRepository,
        jwtToken:IJwttoken
    ){
        this.chatRepo = chatrepository,
        this.jwtToken = jwtToken

    }

    async getVendorChat(token:string,vendorId:string){
        try {
            let isVerifiedToken =  this.jwtToken.verifyJWT(token)
            console.log(isVerifiedToken)
            if(isVerifiedToken){
                const senderId = isVerifiedToken.id
                const result = await this.chatRepo.getvendorChat(token,vendorId,senderId)
                console.log(result)
                if(result != null){
                    return {success:true,conversation:result}
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async sendmessage(message:string,conversationId:string,senderModel:string,receiverId:string,receiverModel:string,token:string){
        try {
            const validToken = await this.jwtToken.verifyJWT(token)
            if(validToken){
               const senderId = validToken.id
            const result = await this.chatRepo.sendMessage(message,conversationId,senderModel,receiverId,receiverModel,senderId)
            if(result != null){
                return {success:true,conversations:result}
            }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async collectUserChats(token:string){
        try {
            console.log("gettting in collectUserChats")
            const validToken = this.jwtToken.verifyJWT(token)
            if(validToken){
                const vendorId = validToken.id
                const result = await this.chatRepo.getUserChat(vendorId)
                if(result){
                    return {success:true,result:result}
                }
            }
        } catch (error) {
            console.error(error) 
        }
    }

    async collectVendoruserChats(token:string,userId:string){
        const validToken = this.jwtToken.verifyJWT(token)
        if(validToken){
            const vendorId = validToken.id
            const result = await this.chatRepo.getVendorUserChat(vendorId,userId)
            if(result){
                return {result}
            }
        }
    }

    async sendMessageToUser(conversationId:string,receiverId:string,message:string,token:string){
        try {
            const isValidToken =  this.jwtToken.verifyJWT(token)
            if(isValidToken){
                const senderId = isValidToken.id
                const result = await this.chatRepo.sendmessageToUser(conversationId,senderId,receiverId,message)
                if(result){
                    return {result}
                }

            }
        } catch (error) {
            console.error(error)
        }
    }
}

export default chatCase