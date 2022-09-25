const nodemailer=require("nodemailer")
const pug=require("pug")
const htmlToText=require("html-to-text")
class Email
{
    constructor(user,url){
        this.to=user.email;
        this.firstName=user.name.split(' ')[0];
        this.url=url;
        this.from=`Rajan chouhan<${process.env.EMAIL_FROM}>`;
    
    }

    newTransport(){
        if(process.env.NODE_ENV==='Development')
        {
            return nodemailer.createTransport({
                service:"SendGrid",
                auth:{
                    user:process.env.SENDGRID_USERNAME,
                    pass:process.env.SENDGRID_PASSWORD
                }
            })
        }
        else
        {
            return nodemailer.createTransport({
                host:process.env.EMAIL_HOST,
                port:process.env.EMAIL_PORT,
                auth:{
                    user:process.env.USERNAME_NODEMAILER_EMAIL,
                    pass:process.env.PASSWORD_NODEMAILER_EMAIL
                }
            })
        }
    }

    async send(template,subject){
        // send the actual email
        //1) Render the HTML based on pug Template
        const htmlEmail=pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject
        });

        const mailOptions={
            to:this.to,
            from:this.from,
            subject,
            html:htmlEmail,
            //text:htmlToText.fromString(htmlEmail)
        }

        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome()
    {
        await this.send("welcome","Welcome to the touring family");
    }

    async sendPasswordReset()
    {
        await this.send("passwordReset","Password reset")
    }
}
module.exports=Email







// exports.sendEmail=async (options)=>{
//     const transporter=nodemailer.createTransport({
//         host:process.env.EMAIL_HOST,
//         port:process.env.EMAIL_PORT,
    
//     auth:{
//         user:process.env.USERNAME_NODEMAILER_EMAIL,
//         pass:process.env.PASSWORD_NODEMAILER_EMAIL
//          }
//     });

//     // define the email options
//    const mailOptions={
//     from:"rajan.chouhan2531@gmail.com",
//     to:options.email,
//     subject:options.subject,
//     text:options.text
//    }
//   await transporter.sendMail(mailOptions)
// }
