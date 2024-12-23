import express from "express";
import {
  checkAdmin,
  verfifyAccessToken,
} from "../middleware/auth.middleware.js";
import {
  addAddressController,
  editAddressController,
  getAddressController,
  removeAddressController,
} from "../controllers/address.controller.js";

const router = express.Router();
router.post("/add-new", verfifyAccessToken, addAddressController);
router.get("/get", verfifyAccessToken, getAddressController);
router.post(
  "/edit/:id_list_address",
  verfifyAccessToken,
  editAddressController
);
router.post(
  "/remove/:id_list_address",
  verfifyAccessToken,
  removeAddressController
);
export default router;
