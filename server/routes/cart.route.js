import express from "express";
import { verfifyAccessToken } from "../middleware/auth.middleware.js";
import {
  addToCartController,
  getCartController,
  removeFromCartController,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.get("/get-cart", verfifyAccessToken, getCartController);
router.post("/add-to-cart", verfifyAccessToken, addToCartController);
router.post("/remove-from-cart", verfifyAccessToken, removeFromCartController);
export default router;
