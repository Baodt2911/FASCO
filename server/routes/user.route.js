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
} from "../controllers/user.controller.js";
import {
  verfifyAccessToken,
  verfifyRefreshToken,
  checkAdmin,
  verfifyIdToken,
} from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/login", loginController);
router.post("/login/google", verfifyIdToken, loginGoogleController);
router.post("/register", registerController);
router.get("/is-login", verfifyRefreshToken, isLoginController);
router.post("/logout", verfifyRefreshToken, logoutController);
router.post("/reset-password", verfifyAccessToken, resetPasswordController);
router.post("/refresh-token", verfifyRefreshToken, refreshTokenController);
router.post("/update-profile", verfifyAccessToken, updateUserController);
export default router;
