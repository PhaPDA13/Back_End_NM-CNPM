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
  static async getById(id, ownerId) {
    const parsedOwnerId = parseInt(ownerId, 10);
    const type = await prisma().agentType.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        agents: {
          where: {
            ownerId: parsedOwnerId,
            isDeleted: false,
          },
        },
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

  // UPDATE - Cập nhật sản phẩm của loại đại lý
  static async updateProducts(agentTypeId, productIds, ownerId) {
    const parsedTypeId = parseInt(agentTypeId, 10);
    const parsedOwnerId = parseInt(ownerId, 10);

    // Kiểm tra loại đại lý có tồn tại
    const foundType = await prisma().agentType.findUnique({
      where: { id: parsedTypeId },
    });

    if (!foundType) {
      throw new ApiError(404, "Không tìm thấy loại đại lý");
    }

    // Kiểm tra tất cả sản phẩm có tồn tại, không bị xóa và thuộc về user hiện tại
    const products = await prisma().product.findMany({
      where: {
        id: { in: productIds },
        ownerId: parsedOwnerId,
        isDeleted: false,
      },
    });

    if (products.length !== productIds.length) {
      throw new ApiError(400, "Một hoặc nhiều sản phẩm không tồn tại hoặc đã bị xóa");
    }

    // Xóa tất cả sản phẩm của user hiện tại trong loại đại lý này
    const userProductIds = products.map((p) => p.id);
    await prisma().agentTypeProduct.deleteMany({
      where: {
        agentTypeId: parsedTypeId,
        productId: { in: userProductIds },
      },
    });

    // Thêm các sản phẩm mới
    const agentTypeProducts = productIds.map((productId) => ({
      agentTypeId: parsedTypeId,
      productId: parseInt(productId, 10),
    }));

    await prisma().agentTypeProduct.createMany({
      data: agentTypeProducts,
    });

    // Lấy lại dữ liệu đã cập nhật (chỉ products của user hiện tại)
    return await prisma().agentType.findUnique({
      where: { id: parsedTypeId },
      include: {
        products: {
          where: {
            product: {
              ownerId: parsedOwnerId,
            },
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }

  // READ - Lấy các sản phẩm của loại đại lý
  static async getProducts(agentTypeId, ownerId) {
    const parsedTypeId = parseInt(agentTypeId, 10);
    const parsedOwnerId = parseInt(ownerId, 10);

    const type = await prisma().agentType.findUnique({
      where: { id: parsedTypeId },
      include: {
        products: {
          where: {
            product: {
              ownerId: parsedOwnerId,
            },
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!type) {
      throw new ApiError(404, "Không tìm thấy loại đại lý");
    }

    return type;
  }
}
