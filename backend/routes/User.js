import { Router } from "express";
import {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  getUserProfile,
  getCurrentUserProfile,
  updateUserPassword,
  updateUserAvatar,
  updateUserName,
  sendOTP,
} from "../controllers/User.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile/:userId").get(getUserProfile);
router.route("/profile").get(verifyJWT, getCurrentUserProfile);
router.route("/update-name").patch(verifyJWT, updateUserName);
router.route("/update-password").patch(verifyJWT, updateUserPassword);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
