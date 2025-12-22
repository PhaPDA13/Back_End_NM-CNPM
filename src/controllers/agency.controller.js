import { AgencyService } from "../services/agency.services.js";

export const getAllAgencies = async (req, res) => {
	try {
		const agencies = await AgencyService.getAll();

		if (!agencies || agencies.length === 0) {
			res.sendStatus(404);
		}

		res.json({
			success: true,
			message: "Get all agencies from database",
			data: agencies,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: err.message,
		});
		throw err;
	}
};
