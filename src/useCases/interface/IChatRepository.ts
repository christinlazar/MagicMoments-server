import messageInterface from "../../domain/message"
import messageModel from "../../infrastructure/database/message"
import conversationModel from "../../infrastructure/database/conversation"
import conversationInterface from "../../domain/coversation"
import videoCallReqInterface from "../../domain/videoCallRequest"
interface IchatRepository{
        getvendorChat(token:string,receiverId:string,senderId:string):Promise <conversationInterface | null | undefined>
        sendMessage(message:string,conversationId:string,senderModel:string,receiverId:string,receiverModel:string,senderId:string):Promise<conversationInterface | null | undefined> 
        getUserChat(vendorId:string):Promise<any | null>
        getVendorUserChat(vendorId:string,userId:string):Promise<conversationInterface | null>
        sendmessageToUser(conversationId:string,senderId:string,receiverId:string,message:string):Promise<conversationInterface | null | undefined>
        // sendVideoCallRequest(userId:string):Promise<videoCallReqInterface | null>

}

export default IchatRepository