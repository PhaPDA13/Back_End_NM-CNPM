import winston from "winston";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(
			({ timestamp, level, message, ...meta }) =>
				`${timestamp} [${level.toUpperCase()}]: ${message} ${
					Object.keys(meta).length ? JSON.stringify(meta) : ""
				}`
		)
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(logsDir, "error.log"),
			level: "error",
		}),
		new winston.transports.File({
			filename: path.join(logsDir, "app.log"),
		}),
	],
});

export default logger;
