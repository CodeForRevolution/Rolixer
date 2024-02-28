const nodeMailer=require("nodemailer");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendEmail=async(options)=>{
 

    const transporter=nodeMailer.createTransport({
    host:process.env.SMPT_HOST,
    port:process.env.SMPT_PORT,
    service:process.env.SMPT_SERVICE,
    auth:{
       user:process.env.SMPT_MAIL,
       pass:"rvsq xyhi snfh ngjg"
    }
    })



    const mailOptions={
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }

    
try {
  
  var send= await  transporter.sendMail(mailOptions);
 
  
} catch (error) {
 console.log('your error',error) 
}


};
module.exports=sendEmail;