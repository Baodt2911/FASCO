import express from "express";
import {
  deletePhotoController,
  addPhotoController,
  uploadPhotoController,
  updatePhotoController,
} from "../controllers/photo.controller.js";
const router = express.Router();
import { upload } from "../config/multer.js";
import { checkAdmin } from "../middleware/auth.middleware.js";
router.post("/add/:_id", checkAdmin, upload.single("file"), addPhotoController);
router.post("/upload", upload.single("file"), uploadPhotoController);
router.put("/update/:_id", checkAdmin, updatePhotoController);
router.delete("/delete/:_id", checkAdmin, deletePhotoController);
export default router;
