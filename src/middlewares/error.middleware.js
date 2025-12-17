import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({ message: "Internal server error" });
}