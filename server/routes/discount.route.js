import express from "express";
import { checkAdmin } from "../middleware/auth.middleware.js";
import {
  createDiscountController,
  deleteDiscountController,
} from "../controllers/discount.controller.js";
const router = express.Router();

router.post("/create", checkAdmin, createDiscountController);
router.delete("/delete/:_id", checkAdmin, deleteDiscountController);

export default router;
