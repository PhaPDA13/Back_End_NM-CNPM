import express from "express";
import {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
} from "../controllers/district.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createDistrictSchema, updateDistrictSchema } from "../validators/district.validator.js";

const router = express.Router();

router.post("/", validate(createDistrictSchema), createDistrict);
router.get("/", getAllDistricts);
router.get("/:id", getDistrictById);
router.put("/:id", validate(updateDistrictSchema), updateDistrict);
router.delete("/:id", deleteDistrict);

export default router;
