import nodemailer from 'nodemailer'
import Inodemailer from '../../useCases/interface/InodeMailer';
import dotenv from 'dotenv'
dotenv.config()
class sendMail{
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
    sendMail(name:string,email:string,verificationCode:string):void{
        const emailContent = `
Dear ${name},

Thank you for choosing Magic Moments for your wedding plans!
To ensure the security of your account, we've generated a One-Time Password (OTP) for you to complete your registration or login process.

Your OTP is: ${verificationCode}

Please use this OTP within the next 5 minutes to complete your action. If you did not initiate this request or need any assistance, please contact our support team immediately.
Thank you for trusting Magic Moments for your travel experiences. We look forward to serving you!

Best regards,
Magic Moments.`;
const mailOPtions:nodemailer.SendMailOptions = {
    from:process.env.EMAIL,
    to:email,
    subject:"Magic-Moments verification code",
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

export default sendMail