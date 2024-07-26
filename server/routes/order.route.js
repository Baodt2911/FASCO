import express from "express";
import {
  completeOrderController,
  createOrderController,
  getDetailOrderController,
  getOrderController,
} from "../controllers/order.controller.js";
import {
  checkAdmin,
  verfifyAccessToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", verfifyAccessToken, createOrderController);
router.post("/complete-order", verfifyAccessToken, completeOrderController);
router.get("/get", verfifyAccessToken, getOrderController);
router.get("/get-detail", checkAdmin, getDetailOrderController);

export default router;
