import nodemailer from 'nodemailer';

export default class MailingService {

    constructor(){
        this.transport = nodemailer.createTransport({
            service:'gmail',
            port:587,
            auth:{
                user:GMAIL_USER,
                pass:GMAIL_PASSWORD
            }
        })
    }

    sendMail = async (mailRequest) =>{
        const result = await transport.sendMail(mailRequest)
        return result;
    }
}