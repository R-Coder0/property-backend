const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `https://property-backend-svf7.vercel.app/api/auth/verify-email?token=${token}`;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
        });
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send verification email to ${email}:`, error);
        throw new Error('Failed to send verification email');
    }
};

module.exports = { sendVerificationEmail };
