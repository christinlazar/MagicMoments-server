interface IMakePayment{
    makeThePayment(companyName:string | undefined,amount:string | undefined,bodyData:any,bookingData:any):Promise<any>
    refund(paymentId:string | undefined):Promise<any>
}

export default IMakePayment