import { Types } from "mongoose";


interface messageInterface {
    chatId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderModel: 'User' | 'Vendor';
    receiverId: Types.ObjectId;
    receiverModel: 'User' | 'Vendor';
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export default messageInterface;
  