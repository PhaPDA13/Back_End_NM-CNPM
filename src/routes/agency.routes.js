import express from "express";
import { getAllAgencies } from "../controllers/agency.controller.js";

const router = express.Router();

router.get("/getall", getAllAgencies);

export default router