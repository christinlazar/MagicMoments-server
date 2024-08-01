import chatCase from "../useCases/chatUseCase"
import { Request,Response } from "express"
class chatController{
    private chatcase:chatCase
    constructor(chatcase:chatCase){
        this.chatcase = chatcase
    }

    async getVendorChat(req:Request,res:Response){
        try {
            const {vendorId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.chatcase.getVendorChat(token,vendorId)
            if(result?.success){
                return res.status(200).json({success:true,conversations:result.conversation})
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({internalServerError:error})
        }
    }

    async sendMessage(req:Request,res:Response){
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            const {message,conversationId,senderModel,receiverId,receiverModel} = req.body
            console.log("message is",message)
            console.log("conversationId",conversationId)
            console.log("senderModel",senderModel)
            console.log("receiverId",receiverId)
            console.log("receiverModel",receiverModel)

            const result = await this.chatcase.sendmessage(message,conversationId,senderModel,receiverId,receiverModel,token)
            if(result?.success){
                return res.status(200).json({success:true,conversations:result.conversations})
            }
        } catch (error) {
            
        }
    }
    async getUserChats(req:Request,res:Response){
        try {
            console.log("reached in to get chats");
            
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.chatcase.collectUserChats(token)
            if(result?.success){
                return res.status(200).json({success:true,result:result.result})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getVendorUserChat(req:Request,res:Response){
        try {
            const {userId} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.chatcase.collectVendoruserChats(token,userId)
            if(result?.result){
                return res.status(200).json({success:true,conversations:result.result})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async sendMessageToUser(req:Request,res:Response){
        try {
            const {conversationId,receiverId,message} = req.body
            const token = req.headers.authorization?.split(' ')[1] as string
            const result = await this.chatcase.sendMessageToUser(conversationId,receiverId,message,token)
            if(result?.result){
                return res.status(200).json({success:true,conversations:result.result})
            }
        } catch (error) {
            console.error(error)
        }
    }

    // async sendVideoCallRequest(req:Request,res:Response){
    //     try {
    //         const token = req.headers.authorization?.split(' ')[1] as string
    //          const result = await this.chatcase.sendMessageReq(token)
    //     } catch (error) {
    //         console.error()
    //     }
    // }
    
}

export default chatController