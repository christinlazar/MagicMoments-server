import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
class bookingAcceptanceMail{
    private transporter:nodemailer.Transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.APP_PASS_KEY
            }
        })
    }
    sendMail(userName:string | undefined,userEmail:string | undefined):void{
        const emailContent = `
Dear ${userName},

Thank you for choosing us to  be the part of your wedding !
We have accepted your booking request.
Now please move to the payment.

`;
const mailOPtions:nodemailer.SendMailOptions = {
    from:process.env.EMAIL,
    to:userEmail,
    subject:"acceptance Mail",
    text:emailContent,
};
this.transporter.sendMail(mailOPtions,(err:any)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Sended succesfully")
       
            }
        })
    }
}

export default bookingAcceptanceMail