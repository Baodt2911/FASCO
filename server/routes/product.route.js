import express from "express";
import { checkAdmin } from "../middleware/auth.middleware.js";
import {
  addProductController,
  deleteProductController,
  getAllProductController,
  getDetailProductController,
  updateProductController,
  uploadController,
} from "../controllers/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();
router.get("/all", getAllProductController);
router.get("/detail", getDetailProductController);
router.post("/upload/:_id", upload.array("files"), uploadController);
router.post("/add-new", addProductController);
router.put("/update", updateProductController);
router.delete("/delete", deleteProductController);
export default router;
