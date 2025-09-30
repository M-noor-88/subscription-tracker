import nodemailer from 'nodemailer';
import dotenv from "dotenv";


dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export default transporter;