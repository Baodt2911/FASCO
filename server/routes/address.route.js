import express from "express";
import { verfifyAccessToken } from "../middleware/auth.middleware.js";
import {
  editAddressController,
  getAddressController,
} from "../controllers/address.controller.js";

const router = express.Router();
router.get("/get", verfifyAccessToken, getAddressController);
router.put("/edit", verfifyAccessToken, editAddressController);
export default router;
