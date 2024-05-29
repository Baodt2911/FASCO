import express from "express";
import { uploadController } from "../controllers/photo.controller.js";
const router = express.Router();
import { upload } from "../config/multer.js";
router.post("/upload/:_id", upload.array("files"), uploadController);

export default router;
