import Admin from "../../domain/admin";
import User from "../../domain/user";
interface IAdminRepository{
    findByEmail(email:string):Promise<Admin | null>;
    findUsers():Promise<User[] | null>;
    blockuser(userId:string):Promise<User|null>;
    unblockuser(userId:string):Promise<User|null>
}

export default IAdminRepository