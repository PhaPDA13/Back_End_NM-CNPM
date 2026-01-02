import express from "express";
import {
  createExportNote,
  getAllExportNotes,
  getExportNoteById,
} from "../controllers/exportNote.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createExportNoteSchema } from "../validators/exportNote.validator.js";

const router = express.Router();

router.post("/", validate(createExportNoteSchema), createExportNote);
router.get("/", getAllExportNotes);
router.get("/:id", getExportNoteById);

export default router;
