const nodemailer = require("nodemailer");

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        //  Activate in email "less secure app" option
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Afolabi Mercy <aaphomer@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions); // IT RETURNS A PROMISE
};


module.exports = sendEmail;
