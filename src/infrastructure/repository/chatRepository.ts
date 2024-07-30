import conversationInterface from "../../domain/coversation"
import IchatRepository from "../../useCases/interface/IChatRepository"
import { getReceiverSocketId, getSocketServer } from "../config/socketServer"
import conversationModel from "../database/conversation"
import messageModel from "../database/message"
import { userModel } from "../database/userModel"
// import {Server} from 'socket.io'

class chatRespository implements IchatRepository{
    async getvendorChat(token:string, receiverId:string,senderId:string): Promise<conversationInterface | null | undefined> {
            try {
             
                const conversations = await conversationModel.findOne({
                    participants:{$all:[
                        {$elemMatch:{participantId:senderId,participantModel:'User'}},
                        {$elemMatch:{participantId:receiverId,participantModel:'Vendor'}}
                    ]}
                }).populate('messages')

                console.log("conversation is",conversations)

                if(!conversations){
                    let conversation = new conversationModel({
                        participants:[
                            {participantId:senderId,participantModel:'User'},
                            {participantId:receiverId,participantModel:'Vendor'}
                    ]
                    })
                    await conversation.save()
                    return conversation
                }else{
                    return conversations
                }


            } catch (error) {
                console.error(error)
                return null
            }
    }

    async sendMessage(message:string,conversationId:string,senderModel:string,receiverId:any,receiverModel:string,senderId:string): Promise<conversationInterface | null | undefined> {
        try {
           
            let receiver = receiverId.participantId
            const newMessage =  new messageModel({
                chatId:conversationId,
                senderId:senderId,
                senderModel,
                receiverId:receiver,
                receiverModel,
                message
            })
            const savedMessage = await newMessage.save()

           
            let conversation
            if(savedMessage){
                 conversation = await conversationModel.findOneAndUpdate({_id:conversationId},{$push:{messages:savedMessage._id}},{new:true}).populate('messages')
                console.log("populated",conversation)
            }
            if(conversation){
                console.log("receiverrrr",receiverId)
                console.log("conversation",conversationId)
                const receiverSocketId = getReceiverSocketId(receiverId.participantId)
                console.log("receiverSocketid1 is",receiverSocketId)
                if(receiverSocketId){
                   const io = getSocketServer()
                    io.to(receiverSocketId).emit('newConversation',conversation)
                }
            return conversation
            }else{
                return undefined
            }

        } catch (error) {
            console.error(error)
            return null
        }
    }

    async getUserChat(vendorId: string): Promise<any| null> {
        try {
            console.log("gotUserChat")
            const conversations = await conversationModel.find({
                participants:{$all:[
                    {$elemMatch:{participantId:vendorId,participantModel:'Vendor'}}
                ]}
            }).populate('participants.participantId').populate('messages')
            

            let newConversations = [...conversations]
            console.log("newConv",newConversations)
            const userIds:any = newConversations.map((conv:any)=>conv.participants[0].participantId)
            let users = []
            console.log("userIds",userIds)
            for(let  i = 0;i<userIds.length;i++){
                const userId = userIds[i]
                console.log("us",userId)
                const udata = await userModel.findOne({_id:userId})
                users.push(udata)
            }
            console.log("useers is",users)
            return {conversations,users}
        } catch (error) {
            return null
        }
    }

    async getVendorUserChat(vendorId:string,userId:string): Promise<conversationInterface | null> {
        try {
            const conversations = await conversationModel.findOne({
                participants:{$all:[
                    {$elemMatch:{participantId:userId,participantModel:'User'}},
                    {$elemMatch:{participantId:vendorId,participantModel:'Vendor'}}
                ]}
            }).populate('messages')
            console.log("messages in getvendoruserchat",conversations)
            return conversations
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async sendmessageToUser(conversationId: string, senderId: string, receiverId: string, message: string): Promise<conversationInterface | null | undefined> {
        try {
            const senderModel = 'Vendor'
            const receiverModel = 'User'
            const newMessage =  new messageModel({
                chatId:conversationId,
                senderId:senderId,
                senderModel,
                receiverId:receiverId,
                receiverModel,
                message
            })
            const savedMessage = await newMessage.save()
            let conversation
            if(savedMessage){
                 conversation = await conversationModel.findOneAndUpdate({_id:conversationId},{$push:{messages:savedMessage._id}},{new:true}).populate('messages')
                console.log("populated",conversation)
            }
            if(conversation){
                const receiverSocketId = getReceiverSocketId(receiverId)
                console.log("receiverSocketid2 is",receiverSocketId)
                if(receiverSocketId){
                    
                    const io = getSocketServer()
                    io.to(receiverSocketId).emit('newConversation',conversation)
                }
                return conversation
            }else{
            return undefined
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }
}

export default chatRespository