import User from "../models/User.js";
import Listing from "../models/Listing.js";
import UserOTPVerification from "../models/UserOTPVerification.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import sendOTPEmail from "../utils/nodeMailer.js";
import { isValidObjectId } from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Simulate token generation logic
    const user = await User.findById(userId);
    // small check for user existence
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in the database
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new Error("User email is required");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    await sendOTPEmail(
      {
        _id: user._id,
        recipientEmail: email,
      },
      res
    );

    return res.status(200).json({
      status: "SUCCESS",
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "FAILED",
      message: "Error sending OTP",
    });
  }
};
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    const userId = user._id;
    // Find the user OTP verification document
    const userOTP = await UserOTPVerification.findOne({ userId });

    if (!userOTP) {
      return res.status(404).json({
        status: "FAILED",
        message: "OTP not found for this user",
      });
    }
    // Check if the OTP is valid
    const isOtpValid = await userOTP.isValidOTP(otp);
    if (!isOtpValid) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid OTP",
      });
    }
    // Check if the OTP has expired
    const isExpired = userOTP.expiresAt < new Date();
    if (isExpired) {
      await UserOTPVerification.deleteOne({ userId });
      sendOTPEmail(
        {
          _id: userId,
          recipientEmail: userOTP.email,
        },
        res
      );
      return res.status(400).json({
        status: "FAILED",
        message: "OTP has expired. A new OTP has been sent to your email.",
      });
    }
    // If OTP is valid and not expired, proceed with verification
    await User.updateOne({ _id: userId }, { verified: true });
    await UserOTPVerification.deleteOne({ userId });
    return res.status(200).json({
      status: "SUCCESS",
      message: "OTP verified successfully",
    });
    // Check if the OTP is valid and not expired
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    // Check if user already exists
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "FAILED",
        message: "Name, email, and password are required",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "FAILED",
        message: "User already exists with this email",
      });
    }
    // Extract avatar image path from req.files
    const avatarLocalPath = req.file?.path;

    let newUser;
    if (avatarLocalPath) {
      let avatar;
      try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
      } catch (error) {
        console.error("Error uploading avatar to Cloudinary:", error.message);
        return res.status(500).json({
          status: "FAILED",
          message: "Error uploading avatar image",
          error: error.message,
        });
      }
      // Create new user
      newUser = await User.create({
        name,
        email,
        password,
        type: type || "user", // Default to "user" if type is not provided
        avatar: avatar?.secure_url,
      });
    } else {
      // Create new user
      newUser = await User.create({
        name,
        email,
        password,
        type: type || "user", // Default to "user" if type is not provided
      });
    }

    const user = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }

    return res.status(201).json({
      status: "SUCCESS",
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "FAILED",
      message: "Email and password are required",
    });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    // Check if the user is verified
    if (!user.verified) {
      return res.status(403).json({
        status: "FAILED",
        message: "User is not verified. Please verify your email first.",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid email or password",
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // Set refresh token in cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    };
    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        status: "SUCCESS",
        message: "User logged in successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        accessToken,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //this removes the refresh token from the user document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      status: "SUCCESS",
      message: "User logged out successfully",
    });
};

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid user ID format",
    });
  }
  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    // if the user is a host, fetch their listings
    if (user.type === "host") {
      const listings = await Listing.find({ owner: userId }).select(
        "-user -createdAt -updatedAt"
      );
      return res.status(200).json({
        status: "SUCCESS",
        message: "User profile fetched successfully",
        user,
        listings: listings || [],
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    // Fetch the current user's profile
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    // if the user is a host, fetch their listings
    if (user.type === "host") {
      const listings = await Listing.find({ owner: req.user._id }).select(
        "-user -createdAt -updatedAt"
      );
      return res.status(200).json({
        status: "SUCCESS",
        message: "User profile fetched successfully",
        user,
        listings: listings || [],
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateUserName = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "FAILED",
      message: "Name is required to update the profile",
    });
  }

  try {
    // Check if the user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    // Update user profile
    user.name = name;

    await user.save();
    // Return updated user profile
    const updatedUser = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found after update",
      });
    }

    return res.status(200).json({
      status: "SUCCESS",
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateUserPassword = async (req, res) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return res.status(400).json({
      status: "FAILED",
      message: "Current password and new password are required",
    });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({
      status: "FAILED",
      message: "New password must be at least 8 characters long",
    });
  }

  try {
    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    // Check if the current password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "FAILED",
        message: "Current password is incorrect",
      });
    }
    // Update the password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateUserAvatar = async (req, res) => {
  console.log("=== Avatar Upload Debug ===");
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);
  console.log("req.user:", req.user);
  console.log("========================");
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }
    // Check if an avatar file is provided
    if (!req.file) {
      console.error("Avatar file not found");
      return res.status(400).json({
        status: "FAILED",
        message: "Avatar file is required",
      });
    }
    // Upload the new avatar to Cloudinary
    let avatar;
    try {
      if (user.avatar) {
        // If the user already has an avatar, delete the old one from Cloudinary
        const publicId = user.avatar.split("/").pop().split(".")[0]; // Extract public ID from URL
        await deleteFromCloudinary(publicId);
      }
      avatar = await uploadOnCloudinary(req.file.path);
    } catch (error) {
      console.error("Error uploading avatar to Cloudinary:", error);
      return res.status(500).json({
        status: "FAILED",
        message: "Error uploading avatar image",
        error: error.message,
      });
    }
    // Update the user's avatar
    user.avatar = avatar?.secure_url;
    await user.save();
    // Return the updated user profile
    const updatedUser = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (!updatedUser) {
      console.log("User not found after updating");
      return res.status(404).json({
        status: "FAILED",
        message: "User not found after update",
      });
    }
    return res.status(200).json({
      status: "SUCCESS",
      message: "User avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  registerUser,
  sendOTP,
  verifyOtp,
  loginUser,
  logoutUser,
  getUserProfile,
  getCurrentUserProfile,
  updateUserName,
  updateUserPassword,
  updateUserAvatar,
};
