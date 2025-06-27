import nodemailer from "nodemailer";
import generateOTP from "./otpGenerator.js";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import UserOTPVerification from "../models/UserOTPVerification.js";

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many OTP requests, try again later" },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL || "youremail@gmail.com",
    pass: process.env.AUTH_EMAIL_PASS, // Use app password, not regular password
  },
});

// Send OTP email
export default async function sendOTPEmail({ _id, recipientEmail }, res) {
  try {
    const otp = generateOTP();

    const mailOptions = {
      from: "dhruvvdemo@gmail.com",
      to: recipientEmail,
      subject: "Email Verification - OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your One-Time Password (OTP) for email verification is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    };

    const userOTP = new UserOTPVerification({
      userId: _id,
      otp,
    });

    await userOTP.save();
    // Send the email
    console.log(`Sending OTP to ${recipientEmail}`);

    await transporter.sendMail(mailOptions);

    console.log(`OTP sent successfully to ${recipientEmail}`);
    return {
      success: true,
      otp, // Only for demo purposes, do not expose in production
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// async function verifyEmail(email){
//   console.log(`sending mail to ${email}`)

//   const result = await sendOTPEmail(email)

//   if (result.success) {
//     console.log(`OTP sent successfully: ${result.otp}`);
//     // In a real application, you would:
//     // 1. Store the OTP with expiration time in database/cache
//     // 2. Not log the OTP (security risk)
//     // 3. Return success without exposing the OTP

//     return result.otp; // Only for demo purposes
//   } else {
//     console.log('Failed to send OTP:', result.error);
//     return null;
//   }
// }
