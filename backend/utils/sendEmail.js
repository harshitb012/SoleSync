const nodeMailer=require("nodemailer")
require("dotenv").config();
//Used for sending email messages
const sendEmail=async(options)=>{
    const transporter=nodeMailer.createTransport({
        
        service:process.env.service,
        auth:{
            user:process.env.mail,
            pass:process.env.password,
        }
    })

const mailoptions={
    from:process.env.mail,
    to:options.email,
    subject:options.subject,
    text:options.message,
}

await transporter.sendMail(mailoptions)
}
module.exports=sendEmail;