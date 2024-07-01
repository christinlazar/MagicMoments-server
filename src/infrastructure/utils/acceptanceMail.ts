import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
class acceptanceMail{
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
    sendMail(companyName:string,companyEmail:string):void{
        const emailContent = `
Dear ${companyName},

Thank you for choosing or plattform for erving your wedding service!
To ensure the security of your security,your account was in request mode.Now  
The request has been accepted now.Start working with us from now onwards.

Best regards,
Magic Moments.`;
const mailOPtions:nodemailer.SendMailOptions = {
    from:process.env.EMAIL,
    to:companyEmail,
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

export default acceptanceMail