require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (username, email, token) => {
    try {
        const subject = "Registration Confirmation";
        const text = `
      <p>Dear ${username},</p>
      <p>Thank you for registering on our website. Please use the following token code to verify your account:</p>
      <p><strong>${token.token}</strong></p>
      <p>If you did not register on our website, please ignore this email.</p>
      <p>Best regards,</p>
      <p>Your Website Team</p>
    `;

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: text, // Use 'html' instead of 'text' to send HTML content
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email not sent!");
        console.log(error);
        return error;
    }
};

module.exports = sendEmail;
