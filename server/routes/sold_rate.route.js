import express from "express";
import { verfifyAccessToken } from "../middleware/auth.middleware.js";
import {
  addRateController,
  addSoldController,
  getSoldRateController,
} from "../controllers/sold_rate.controller.js";
const router = express.Router();

router.get("/get", getSoldRateController);
router.post("/inc-rate", verfifyAccessToken, addRateController);
router.post("/inc-sold", verfifyAccessToken, addSoldController);
export default router;
