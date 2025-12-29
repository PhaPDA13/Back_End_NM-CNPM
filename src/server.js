import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import agencyRoutes from "./routes/agency.routes.js";
import userRoutes from "./routes/user.routes.js";
import { corsOptions } from "./config/cors.js";
import errorHandler from "./middlewares/error.middleware.js";
import verifyJWT from "./middlewares/auth.middleware.js";

dotenv.config();

const { Pool } = pkg;

const startServer = async () => {
	// Connect PostgreSQL
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
	});

	try {
		await pool.query("SELECT 1");
		console.log("PostgreSQL connected");
	} catch (error) {
		console.error("PostgreSQL connection failed", error);
		throw error;
	}

	// Create Express app
	const app = express();

	// Middlewares
	app.use(cors(corsOptions));
	app.use(express.json());
	app.use(cookieParser());

	// Routes
	app.use("/user", userRoutes);

	//Verify
	app.use(verifyJWT);
	app.use("/api/agency", agencyRoutes);

	// Error handler
	app.use(errorHandler);

	// Start server
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

startServer();
