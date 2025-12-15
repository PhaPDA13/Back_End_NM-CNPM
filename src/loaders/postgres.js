import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export default async function postgresLoader() {
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
}
