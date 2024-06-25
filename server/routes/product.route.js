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
router.post("/add-new", checkAdmin, addProductController);
router.put("/update", checkAdmin, updateProductController);
router.delete("/delete", checkAdmin, deleteProductController);
export default router;
