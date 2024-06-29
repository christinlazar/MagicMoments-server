interface User{
    _id?:string,
    name:string,
    email:string,
    image?:string,
    password:string,
    isBlocked:boolean,
    phone:string,
    createdAt:Date
}
export default User