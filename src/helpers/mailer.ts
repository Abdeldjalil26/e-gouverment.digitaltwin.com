// In your mailer.ts file
import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

// Load environment variables manually
const { MONGO_URI, TOKEN_SECRET, DOMAIN, GMAIL_USER, GMAIL_PASS } = process.env;
const gmail = process.env.GMAIL_USER;
const password = process.env.GMAIL_PASS;

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 })
        }

        // Create transporter for Gmail
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmail,
                pass: password
            }
        });

        // Email options
        const mailOptions = {
            from: gmail,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        };

        // Send email
        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}
