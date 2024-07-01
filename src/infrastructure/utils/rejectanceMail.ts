import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
class rejectingMail{
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

Thank you for choosing or plattform for serving your wedding service!
But currently we are unable to move forward with your request .
sorry! :)

Best regards,
Magic Moments.`;
const mailOPtions:nodemailer.SendMailOptions = {
    from:process.env.EMAIL,
    to:companyEmail,
    subject:"Rejectance Mail",
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

export default rejectingMail