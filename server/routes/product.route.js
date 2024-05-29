import express from "express";
import { checkAdmin } from "../middleware/auth.middleware.js";
import {
  addProductController,
  deleteProductController,
  getAllProductController,
  getDetailProductController,
  searchProductController,
  updateProductController,
} from "../controllers/product.controller.js";

const router = express.Router();
router.get("/all", getAllProductController);
router.get("/detail", getDetailProductController);
router.get("/search", searchProductController);
router.post("/add-new", addProductController);
router.put("/update", updateProductController);
router.delete("/delete", deleteProductController);
export default router;
