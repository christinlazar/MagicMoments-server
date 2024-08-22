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
    async makeThePayment(companyName:string,amount:string | any,bodyData:any,bookingData:any){
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
            mode:'payment', 
           })
           console.log("sesssion",session)
           return session
        } catch (error) {
            console.log("Error in payment",error)
        }
    }

    async refund(paymentId: string): Promise<any> {
        const session = await stripe.checkout.sessions.retrieve(paymentId);
        const paymentIntentId = session.payment_intent;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        const chargeId = paymentIntent.latest_charge
        const refund = await stripe.refunds.create({
            charge:chargeId,
            amount:paymentIntent.amount
        })
        return refund
    }
}

export default makePayment
