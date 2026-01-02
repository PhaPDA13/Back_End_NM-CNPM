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
            id: true,
            name: true,
          },
        },
        agentType: {
          select: {
            id: true,
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

  static async search(query, ownerId) {
    const db = prisma(ownerId);
    const where = {
      AND: [],
    };

    // Tìm theo tên
    if (query.name) {
      where.AND.push({
        name: {
          contains: query.name,
          mode: "insensitive",
        },
      });
    }

    // Tìm theo quận
    if (query.districtId) {
      where.AND.push({
        districtId: parseInt(query.districtId, 10),
      });
    }

    // Tìm theo loại đại lý
    if (query.agentTypeId) {
      where.AND.push({
        agentTypeId: parseInt(query.agentTypeId, 10),
      });
    }

    // Nếu không có điều kiện nào, trả về rỗng
    if (where.AND.length === 0) {
      return [];
    }

    const agents = await db.agent.findMany({
      where,
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
            id: true,
            name: true,
          },
        },
        agentType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return agents;
  }

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

  // GET - Top 5 đại lý theo doanh thu trong tháng
  static async getTop5ByRevenue(ownerId) {
    const db = prisma(ownerId);

    // Lấy ngày đầu tháng và cuối tháng
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Lấy danh sách đại lý với tổng doanh thu trong tháng
    const agents = await db.agent.findMany({
      where: {
        exportNotes: {
          some: {
            issueDate: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        debtAmount: true,
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
        exportNotes: {
          where: {
            issueDate: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth,
            },
          },
          select: {
            total: true,
          },
        },
      },
      orderBy: {
        exportNotes: {
          _count: "desc",
        },
      },
      take: 5,
    });

    // Tính tổng doanh thu cho mỗi đại lý
    const result = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      phone: agent.phone,
      email: agent.email,
      debtAmount: agent.debtAmount,
      district: agent.district.name,
      agentType: agent.agentType.name,
      revenue: agent.exportNotes.reduce((sum, note) => sum + note.total, 0),
      orderCount: agent.exportNotes.length,
    }));

    // Sắp xếp lại theo doanh thu giảm dần
    return result.sort((a, b) => b.revenue - a.revenue);
  }
}
