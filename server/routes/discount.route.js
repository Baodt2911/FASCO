import express from "express";
import {
  checkAdmin,
  verfifyAccessToken,
} from "../middleware/auth.middleware.js";
import {
  createDiscountController,
  deleteDiscountController,
  getDiscountController,
} from "../controllers/discount.controller.js";
const router = express.Router();

router.post("/create", checkAdmin, createDiscountController);
router.get("/get-discount/:code", verfifyAccessToken, getDiscountController);
router.delete("/delete/:_id", checkAdmin, deleteDiscountController);

export default router;
