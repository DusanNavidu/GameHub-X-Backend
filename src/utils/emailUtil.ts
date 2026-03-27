import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: `"GameHub-X" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Failed to send email");
    }
};