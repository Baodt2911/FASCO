import express from "express";
import { verfifyAccessToken } from "../middleware/auth.middleware.js";
import {
  addToCartController,
  getCartController,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.get("/get-cart", getCartController);
router.post("/add-to-cart", addToCartController);
router.post("/remove-product", verfifyAccessToken);
export default router;
