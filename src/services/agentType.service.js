import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class AgentTypeService {
  // CREATE - Tạo loại đại lý mới
  static async create(data) {
    const foundType = await prisma().agentType.findUnique({
      where: {
        name: data.name,
      },
    });

    if (foundType) {
      throw new ApiError(400, "Loại đại lý đã tồn tại");
    }

    return await prisma().agentType.create({
      data: {
        name: data.name,
        maxDebt: parseFloat(data.maxDebt),
      },
    });
  }

  // READ - Lấy tất cả loại đại lý
  static async getAll() {
    const types = await prisma().agentType.findMany({
      select: {
        id: true,
        name: true,
        maxDebt: true,
      },
    });

    return types;
  }

  // READ - Lấy loại đại lý theo ID
  static async getById(id) {
    const type = await prisma().agentType.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        agents: true,
      },
    });

    if (!type) {
      throw new ApiError(404, "Không tìm thấy loại đại lý");
    }

    return type;
  }

  // UPDATE - Cập nhật loại đại lý
  static async update(id, data) {
    const parsedId = parseInt(id, 10);

    const foundType = await prisma().agentType.findUnique({
      where: { id: parsedId },
    });

    if (!foundType) {
      throw new ApiError(404, "Không tìm thấy loại đại lý");
    }

    // Kiểm tra tên trùng lặp nếu tên thay đổi
    if (data.name && data.name !== foundType.name) {
      const existingType = await prisma().agentType.findUnique({
        where: { name: data.name },
      });
      if (existingType) {
        throw new ApiError(400, "Tên loại đại lý đã tồn tại");
      }
    }

    return await prisma().agentType.update({
      where: { id: parsedId },
      data: {
        name: data.name,
        maxDebt: data.maxDebt ? parseFloat(data.maxDebt) : undefined,
      },
    });
  }

  // DELETE - Xóa loại đại lý
  static async delete(id) {
    const parsedId = parseInt(id, 10);

    const foundType = await prisma().agentType.findUnique({
      where: { id: parsedId },
    });

    if (!foundType) {
      throw new ApiError(404, "Không tìm thấy loại đại lý");
    }

    // Kiểm tra có đại lý thuộc loại này không
    const agentCount = await prisma().agent.count({
      where: { agentTypeId: parsedId },
    });

    if (agentCount > 0) {
      throw new ApiError(400, "Không thể xóa loại đại lý đang được sử dụng");
    }

    return await prisma().agentType.delete({
      where: { id: parsedId },
    });
  }
}
