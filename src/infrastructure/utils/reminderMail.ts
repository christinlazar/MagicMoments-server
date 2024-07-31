import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
class reminderMail{
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
    sendMail(clientName:string,clientEmail:string,date:string):void{
        const emailContent = `
Dear ${clientName},

Hello! This is a reminder that your wedding photography booking is coming up on ${date}.`;
const mailOPtions:nodemailer.SendMailOptions = {
    from:process.env.EMAIL,
    to:clientEmail,
    subject:"Upcoming Wedding Photography Booking Reminder",
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

export default reminderMail