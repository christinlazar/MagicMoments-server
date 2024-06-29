
import ihashPassword from "../../useCases/interface/IhashPassword";
import bcrypt from 'bcrypt'

class hashPassword implements ihashPassword{
   
    async createHash(password:string):Promise<string>{
        console.log(password)
        console.log("inside createHash")
       const  hashedPassword = await bcrypt.hash(password,10)
       console.log("ashed pass",hashedPassword)
       return hashedPassword
    }
    async compare(password:string,hashedPassword:string):Promise<boolean>{
        const passwordMatch = await bcrypt.compare(password,hashedPassword)
            return passwordMatch
        
    }
}
export default hashPassword