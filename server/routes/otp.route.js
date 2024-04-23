import express from "express";
import { sendOtpController } from "../controllers/otp.controller.js";
const router = express.Router();

router.post("/send-otp", sendOtpController);

export default router;
