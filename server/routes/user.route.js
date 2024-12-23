import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  updateUserController,
  isLoginController,
  loginGoogleController,
  getUserController,
  changePasswordController,
  forgotPasswordController,
} from "../controllers/user.controller.js";
import {
  verfifyAccessToken,
  verfifyRefreshToken,
  checkAdmin,
  verfifyIdToken,
} from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/me", verfifyAccessToken, getUserController);
router.post("/login", loginController);
router.post("/login/google", verfifyIdToken, loginGoogleController);
router.post("/register", registerController);
router.get("/is-login", verfifyRefreshToken, isLoginController);
router.post("/logout", verfifyRefreshToken, logoutController);
router.post("/refresh-token", verfifyRefreshToken, refreshTokenController);
router.post("/update-profile", verfifyAccessToken, updateUserController);
router.post("/change-password", verfifyAccessToken, changePasswordController);
router.post("/forget-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
export default router;
