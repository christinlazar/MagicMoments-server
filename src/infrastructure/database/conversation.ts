import mongoose, { Schema, Model } from "mongoose";
import conversationInterface from "../../domain/coversation";

const conversationSchema: Schema<conversationInterface> = new Schema({
    participants: [
        {
            participantId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: 'participantModel'
            },
            participantModel: {
                type: String,
                required: true,
                enum: ['User', 'Vendor']
            }
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ],
    lastMessage: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const conversationModel: Model<conversationInterface> = mongoose.model<conversationInterface>('Conversation', conversationSchema);

export default conversationModel;