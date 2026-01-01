import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class AgentService {
  // CREATE - Tạo đại lý mới
  static async create(data, ownerId) {
    const db = prisma(ownerId);

    const foundDistrict = await prisma().district.findUnique({
      where: {
        id: data.districtId,
      },
    });

    const foundType = await prisma().agentType.findUnique({
      where: {
        id: data.agentTypeId,
      },
    });

    if (!foundDistrict) {
      throw new ApiError(400, "Quận không tồn tại");
    }

    //QĐ 1: Kiểm tra số lượng đại lý trong quận
    const countDistrictAgents = await db.agent.count({
      where: {
        districtId: foundDistrict.id,
      },
    });

    if (countDistrictAgents >= foundDistrict.maxAgents) {
      throw new ApiError(400, "Số lượng đại lý trong quận đã đạt giới hạn");
    }

    if (!foundType) {
      throw new ApiError(400, "Loại đại lý không tồn tại");
    }

    return await db.agent.create({
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email,
        districtId: data.districtId,
        agentTypeId: data.agentTypeId,
      },
    });
  }

  static async getAll(ownerId) {
    const agents = await prisma(ownerId).agent.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        email: true,
        debtAmount: true,
        createdAt: true,
        updatedAt: true,
        district: {
          select: {
            name: true,
          },
        },
        agentType: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!agents) {
      throw new ApiError(400, "Danh sách đại lý rỗng");
    }

    return agents;
  }

  static async;

  static async getById(id, ownerId) {
    const foundAgent = await prisma(ownerId).agent.findUnique({
      where: { id: id },
      include: {
        district: true,
        agentType: true,
      },
    });

    if (!foundAgent) {
      throw new ApiError(404, "Không tìm thấy đại lý");
    }

    return foundAgent;
  }

  static async update(id, updatedData, ownerId) {
    const parsedId = parseInt(id, 10);
    const db = prisma(ownerId);

    //Kiểm tra đại lý tồn tại
    const foundAgent = await db.agent.findUnique({
      where: { id: parsedId },
    });

    if (!foundAgent) {
      throw new ApiError(404, "Không tìm thấy đại lý");
    }

    //Kiểm tra quận tồn tại nếu có
    if (updatedData.districtId) {
      const district = await prisma().district.findUnique({
        where: { id: updatedData.districtId },
      });
      if (!district) throw new ApiError(400, "Quận không tồn tại");
    }

    //Kiểm tra loại đại lý tồn tại nếu có
    if (updatedData.agentTypeId) {
      const type = await prisma().agentType.findUnique({
        where: { id: updatedData.agentTypeId },
      });
      if (!type) throw new ApiError(400, "Loại đại lý không tồn tại");
    }

    return db.agent.update({
      where: { id: parsedId },
      data: {
        name: updatedData.name,
        phone: updatedData.phone,
        address: updatedData.address,
        email: updatedData.email,
        districtId: updatedData.districtId,
        agentTypeId: updatedData.agentTypeId,
        debtAmount: updatedData.debtAmount,
      },
    });
  }

  static async deleteAgent(id, ownerId) {
    const parsedId = parseInt(id, 10);
    const db = prisma(ownerId);

    const foundAgent = await db.agent.findUnique({
      where: { id: parsedId },
    });

    if (!foundAgent) {
      throw new ApiError(404, "Không tìm thấy đại lý");
    }

    return db.agent.update({
      where: {
        id: parsedId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
