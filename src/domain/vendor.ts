export enum AcceptanceStatus {
    Requested = 'requested',
    Accepted = 'accepted',
    Rejected = 'rejected'
}
interface Location {
    type: 'Point'; 
    coordinates: [number,number]; 
}
interface Vendor{
    _id?:string;
    companyName:string;
    companyEmail:string;
    companyLocation:string;
    password:string;
    createdAt:Date;
    category:string;
    isAccepted:AcceptanceStatus;
    photos:string[];
    videos:string[];
    description:string;
    phoneNumber:string;
    startingPrice:string;
    unAvailableDates:string[];
    services?:string[];
    locations:Location[];
    isBlocked:boolean;
}

export default Vendor