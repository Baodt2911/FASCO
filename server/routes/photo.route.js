import express from "express";
import { uploadController } from "../controllers/photo.controller.js";
const router = express.Router();
import { upload } from "../config/multer.js";
import { checkAdmin } from "../middleware/auth.middleware.js";
router.post(
  "/upload/:_id",
  checkAdmin,
  upload.array("files"),
  uploadController
);

export default router;
