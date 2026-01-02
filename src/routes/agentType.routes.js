import express from "express";
import {
  createAgentType,
  getAllAgentTypes,
  getAgentTypeById,
  updateAgentType,
  deleteAgentType,
  updateAgentTypeProducts,
  getAgentTypeProducts,
} from "../controllers/agentType.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAgentTypeSchema, updateAgentTypeSchema } from "../validators/agentType.validator.js";

const router = express.Router();

router.post("/", validate(createAgentTypeSchema), createAgentType);
router.get("/", getAllAgentTypes);
router.get("/:id", getAgentTypeById);
router.put("/:id", validate(updateAgentTypeSchema), updateAgentType);
router.delete("/:id", deleteAgentType);
router.put("/:id/products", updateAgentTypeProducts);
router.get("/:id/products", getAgentTypeProducts);

export default router;
