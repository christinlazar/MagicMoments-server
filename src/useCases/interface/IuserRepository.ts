import User from "../../domain/user";

interface IuserRepository{
    findByEmail(email:string,phone?:number):Promise<User | null>,
    saveUser(user:User) : Promise<User | null>
    saveHashedPassword(password:string,email:string):Promise<User | null>
}

export default IuserRepository;