const nodemailer = require('nodemailer');

require('dotenv').config();

const sendEmail = async (email, password,html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   const sendmail= await transporter.sendMail({
      from: {
        name: "Sakonnet",
        address: process.env.EMAIL_USER,
      },
      to: email, // Email address to send to
      subject: "PGI Information",
      html: html
    });
    return sendmail

  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendEmail
};



