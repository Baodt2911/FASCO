import express from "express";
import {
  getPaymentController,
  refundPaymentController,
} from "../controllers/payment.controller.js";
import { verfifyAccessToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/get/:orderId", verfifyAccessToken, getPaymentController);
router.post("/refund/:orderId", verfifyAccessToken, refundPaymentController);
export default router;
