import express from "express";
import {
  createDealController,
  getAllDealController,
  getDealController,
  changeStatusDealController,
  deleteDealController,
  updateDealController,
} from "../controllers/deal.controller.js";
import { checkAdmin } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/get", getDealController);
router.get("/get-all", checkAdmin, getAllDealController);
router.post("/create", checkAdmin, createDealController);
router.post("/change-status/:_id", checkAdmin, changeStatusDealController);
router.post("/update/:_id", checkAdmin, updateDealController);
router.delete("/delete/:_id", checkAdmin, deleteDealController);
export default router;
