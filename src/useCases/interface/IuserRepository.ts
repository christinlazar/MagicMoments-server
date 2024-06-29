import User from "../../domain/user";

interface IuserRepository{
    findByEmail(email:string,phone?:string):Promise<User | null>,
    saveUser(user:User) : Promise<User | null>
}

export default IuserRepository;