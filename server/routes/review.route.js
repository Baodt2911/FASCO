import express from "express";
import { verfifyAccessToken } from "../middleware/auth.middleware.js";
import {
  createNewReviewController,
  getReviewProductController,
} from "../controllers/reviews.controller.js";
const router = express.Router();
router.get("/get-review", getReviewProductController);
router.post("/new-review", verfifyAccessToken, createNewReviewController);
export default router;
