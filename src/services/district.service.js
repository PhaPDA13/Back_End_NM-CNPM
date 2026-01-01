import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class DistrictService {
  // CREATE - Tạo quận mới
  static async create(data) {
    const foundDistrict = await prisma().district.findUnique({
      where: {
        name: data.name,
      },
    });

    if (foundDistrict) {
      throw new ApiError(400, "Quận đã tồn tại");
    }

    return await prisma().district.create({
      data: {
        name: data.name,
        maxAgents: data.maxAgents || 4,
      },
    });
  }

  // READ - Lấy tất cả quận
  static async getAll() {
    const districts = await prisma().district.findMany({
      select: {
        id: true,
        name: true,
        maxAgents: true,
      },
    });

    return districts;
  }

  // READ - Lấy quận theo ID
  static async getById(id) {
    const district = await prisma().district.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        agents: true,
      },
    });

    if (!district) {
      throw new ApiError(404, "Không tìm thấy quận");
    }

    return district;
  }

  // UPDATE - Cập nhật quận
  static async update(id, data) {
    const parsedId = parseInt(id, 10);

    const foundDistrict = await prisma().district.findUnique({
      where: { id: parsedId },
    });

    if (!foundDistrict) {
      throw new ApiError(404, "Không tìm thấy quận");
    }

    // Kiểm tra tên trùng lặp nếu tên thay đổi
    if (data.name && data.name !== foundDistrict.name) {
      const existingDistrict = await prisma().district.findUnique({
        where: { name: data.name },
      });
      if (existingDistrict) {
        throw new ApiError(400, "Tên quận đã tồn tại");
      }
    }

    return await prisma().district.update({
      where: { id: parsedId },
      data: {
        name: data.name,
        maxAgents: data.maxAgents,
      },
    });
  }

  // DELETE - Xóa quận
  static async delete(id) {
    const parsedId = parseInt(id, 10);

    const foundDistrict = await prisma().district.findUnique({
      where: { id: parsedId },
    });

    if (!foundDistrict) {
      throw new ApiError(404, "Không tìm thấy quận");
    }

    // Kiểm tra có đại lý trong quận không
    const agentCount = await prisma().agent.count({
      where: { districtId: parsedId },
    });

    if (agentCount > 0) {
      throw new ApiError(400, "Không thể xóa quận có đại lý");
    }

    return await prisma().district.delete({
      where: { id: parsedId },
    });
  }
}
