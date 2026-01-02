import express from "express";
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
} from "../controllers/receipt.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReceiptSchema } from "../validators/receipt.validator.js";

const router = express.Router();

router.post("/", validate(createReceiptSchema), createReceipt);
router.get("/", getAllReceipts);
router.get("/:id", getReceiptById);

export default router;
