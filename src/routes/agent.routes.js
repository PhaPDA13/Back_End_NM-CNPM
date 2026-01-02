import express from "express";
import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  searchAgent,
  getTop5ByRevenue,
} from "../controllers/agent.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAgentSchema } from "../validators/agent.create.validator.js";
import { updateAgentSchema } from "../validators/agent.update.validator.js";

const router = express.Router();

router.get("/top-revenue", getTop5ByRevenue);
router.get("/search", searchAgent);
router.post("/", validate(createAgentSchema), createAgent);
router.get("/", getAllAgents);
router.get("/:id", getAgentById);
router.put("/:id", validate(updateAgentSchema), updateAgent);
router.delete("/:id", deleteAgent);

export default router;
