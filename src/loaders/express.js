import express from "express";
import cors from "cors";
import agencyRoutes from "../routes/agency.routes.js"
import { corsOptions } from "../config/cors.js";
import errorHandler from "../middlewares/error.middleware.js"

export default ({ app }) => {
  app.use(cors(corsOptions));
  app.use(express.json());

  app.use("/api/agency", agencyRoutes);

  app.use(errorHandler);
};