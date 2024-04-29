import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  updateUserController,
} from "../controllers/user.controller.js";
import {
  verfifyAccessToken,
  verfifyRefreshToken,
  checkAdmin,
} from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/logout", verfifyRefreshToken, logoutController);
router.post("/reset-password", verfifyAccessToken, resetPasswordController);
router.post("/refresh-token", refreshTokenController);
router.post("/update-profile", verfifyAccessToken, updateUserController);
export default router;
