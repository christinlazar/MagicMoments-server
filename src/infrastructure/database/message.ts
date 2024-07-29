import messageInterface from "../../domain/message";
import mongoose, { Model, Schema } from "mongoose";

const messageSchema: Schema<messageInterface> = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Vendor']
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Vendor']
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const messageModel: Model<messageInterface> = mongoose.model<messageInterface>('Message', messageSchema);
export default messageModel;
