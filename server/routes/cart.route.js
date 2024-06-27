import express from "express";
import { verfifyAccessToken } from "../middleware/auth.middleware.js";
import {
  addToCartController,
  getCartController,
  removeProductCartController,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.get("/get-cart", verfifyAccessToken, getCartController);
router.post("/add-to-cart", verfifyAccessToken, addToCartController);
router.post("/remove-product", verfifyAccessToken, removeProductCartController);
export default router;
