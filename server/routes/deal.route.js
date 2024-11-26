import express from "express";
import {
  createDealController,
  getDealController,
  updateDealController,
} from "../controllers/deal.controller.js";
import { checkAdmin } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/get", getDealController);
router.post("/create", checkAdmin, createDealController);
router.put("/update/:_id", checkAdmin, updateDealController);
export default router;
