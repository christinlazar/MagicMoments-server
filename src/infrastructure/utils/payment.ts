const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY  )
import IMakePayment from '../../useCases/interface/IMakePayment'
import dotenv from 'dotenv'
dotenv.config()
import axios,{AxiosInstance} from 'axios'


const Api:AxiosInstance = axios.create({
    baseURL:'http://localhost:5000/api',
    withCredentials:true
}) 

class makePayment implements IMakePayment {
    async makeThePayment(companyName:string,amount:string | any,bodyData:any){
        console.log("bodyData is",bodyData)
        const companyname = bodyData.companyName
        const vendorId = bodyData.vendorId
        const Amount = bodyData.amount
        const items = [
              companyname,vendorId,Amount
        ]
        let line_items = [
            {
                price_data:{
                    currency: 'inr',
                    product_data : {
                        name:"test"
                    },
                    unit_amount : amount * 100
                },
                quantity:1
            }
        ]
        try {
           const session = await stripe.checkout.sessions.create({
            success_url:`http://localhost:5000/api/user/confirmPayment` ,
            cancel_url :`http://localhost:5000/api/user/paymentFailed`,
            line_items:line_items,
            mode:'payment'
           })
           return session
        } catch (error) {
            console.log("Error in payment",error)
        }
    }
}

export default makePayment
