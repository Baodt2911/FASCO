import express from "express";
import {
  createDealController,
  getDealController,
  updateDealController,
} from "../controllers/deal.controller.js";
const router = express.Router();
router.get("/get", getDealController);
router.post("/create", createDealController);
router.put("/update/:_id", updateDealController);
export default router;
