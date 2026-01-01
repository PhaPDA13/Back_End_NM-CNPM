import express from "express";
import {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "../controllers/unit.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUnitSchema, updateUnitSchema } from "../validators/unit.validator.js";

const router = express.Router();

router.post("/", validate(createUnitSchema), createUnit);
router.get("/", getAllUnits);
router.get("/:id", getUnitById);
router.put("/:id", validate(updateUnitSchema), updateUnit);
router.delete("/:id", deleteUnit);

export default router;
