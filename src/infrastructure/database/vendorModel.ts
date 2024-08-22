import mongoose ,{Schema,Model} from "mongoose";
import Vendor, { AcceptanceStatus } from "../../domain/vendor";

const locationSchema = new mongoose.Schema({
    location:{
        type:{
            type:String,
            enum:['Point'],
            default:'Point'
        },
        coordinates:[{
            type:Number,
            required:true
        }]
    }
})

const VendorSchema: Schema<Vendor> = new Schema({
    companyName: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true
    },
    companyLocation: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
        required: true
    },
    isAccepted: {
        type: String,
        enum: Object.values(AcceptanceStatus),
        default: AcceptanceStatus.Requested
    },
    photos: {
        type: [String]
    },
    videos: {
        type: [String]
    },
    description: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    startingPrice: {
        type: mongoose.Schema.Types.Mixed,
    },
    unAvailableDates: {
        type: [String],
        default: []
    },
    services: {
        type: [String],
        default: []
    },
    locations:[{
        type:locationSchema
    }],
    isBlocked: {
        type: Boolean,
        default: false
    }
});

// VendorSchema.path('locations').default([])   
locationSchema.index({location: '2dsphere' });

const vendorModel:Model<Vendor> = mongoose.model<Vendor>('Vendor',VendorSchema)
export default vendorModel
