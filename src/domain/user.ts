interface User{
    _id?:string,
    name:string,
    email:string,
    image?:string,
    password:string,
    isBlocked:boolean,
    phone:number,
    createdAt:Date
}
export default User