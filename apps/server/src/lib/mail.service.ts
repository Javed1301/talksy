import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("Checking Email Config:", process.env.EMAIL_USER ? "User Loaded" : "User MISSING");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!
    },

});

export const sendVerificationEmail = async(to:string, url:string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Verify your email for Talksy',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #008069;">Verify your email</h2>
                <p>Hi there,</p>
                <p>Thanks for joining Talksy! Please click the button below to verify your email address. This link expires in 24 hours.</p>
                <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #008069; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
                <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            `,
    }

    return transporter.sendMail(mailOptions);
}