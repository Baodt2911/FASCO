import express from "express";
import { checkAdmin } from "../middleware/auth.middleware.js";
import {
  getDaySaleController,
  getMonthSaleController,
} from "../controllers/sale.controller.js";
const router = express.Router();

router.get("/month-sale", checkAdmin, getMonthSaleController);
router.get("/day-sale", checkAdmin, getDaySaleController);

export default router;
