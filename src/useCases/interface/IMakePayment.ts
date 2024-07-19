interface IMakePayment{
    makeThePayment(companyName:string | undefined,amount:string | undefined,bodyData:any):Promise<any>
}

export default IMakePayment