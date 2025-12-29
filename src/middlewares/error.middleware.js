// middlewares/errorHandler.js
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

export default function errorHandler(err, req, res, next) {

	let error = { ...err };
	error.message = err.message;

	// Log chi tiết
	logger.error("Unhandled error", {
		message: err.message,
		stack: err.stack,
		path: req.originalUrl,
		method: req.method,
	});

	const statusCode = error.statusCode || 500;

	res.status(statusCode).json({
		success: false,
		error: {
			code: error.code || "INTERNAL_ERROR",
			message:
				statusCode === 500
					? "Internal server error"
					: error.message,
		},
	});
}
