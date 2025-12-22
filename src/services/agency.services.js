import { prisma } from '../lib/prisma.js'

export class AgencyService {
	// Xem danh sách đại lý
	static async getAll() {
		const agencies = await prisma.ho_so_dai_ly.findMany();
		return agencies;
	}
}
