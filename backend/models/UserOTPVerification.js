import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userOTPVerificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

userOTPVerificationSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();

  this.createdAt = new Date();

  this.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

userOTPVerificationSchema.methods.isValidOTP = async function (otp) {
  return await bcrypt.compare(otp, this.otp);
};

const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  userOTPVerificationSchema
);

export default UserOTPVerification;
