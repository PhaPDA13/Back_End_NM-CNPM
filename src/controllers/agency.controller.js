import { AgencyService } from "../services/agency.service.js";

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
		next(err);
	}
};
