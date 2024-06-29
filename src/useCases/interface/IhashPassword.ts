
interface ihashPassword{
    createHash(password:string):Promise<string>,
    compare(password:string,hashedPaswword:string):Promise<boolean>
}
export default ihashPassword