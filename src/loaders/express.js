import express from "express";
import cors from "cors";
// import routes from "../routes/index.js";
import { corsOptions } from "../config/cors.js";
import { errorHandler } from "../middlewares/error.middleware.js";

export default ({ app }) => {
  app.use(cors(corsOptions));
  app.use(express.json());

//   app.use("/api", routes);

  app.use(errorHandler);
};