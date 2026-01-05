import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class ProductService {
  // CREATE - Tạo sản phẩm mới
  static async create(data, ownerId) {
    const db = prisma(ownerId);
    const foundProduct = await db.product.findUnique({
      where: {
        name: data.name,
      },
    });

    if (foundProduct) {
      throw new ApiError(400, "Sản phẩm đã tồn tại");
    }

    // Nếu có unitIds, kiểm tra tất cả unit tồn tại
    if (data.unitIds && Array.isArray(data.unitIds) && data.unitIds.length > 0) {
      const units = await db.unit.findMany({
        where: {
          id: {
            in: data.unitIds,
          },
        },
      });

      if (units.length !== data.unitIds.length) {
        throw new ApiError(400, "Một hoặc nhiều đơn vị tính không tồn tại");
      }
    }

    // Sử dụng transaction để đảm bảo tính nhất quán
    return await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: data.name,
          price: parseFloat(data.price),
        },
      });

      // Nếu có unitIds, gắn các unit vào sản phẩm
      if (data.unitIds && Array.isArray(data.unitIds) && data.unitIds.length > 0) {
        await tx.productUnit.createMany({
          data: data.unitIds.map((unitId) => ({
            productId: product.id,
            unitId: parseInt(unitId, 10),
          })),
        });

        // Lấy danh sách unit mới tạo
        const units = await tx.productUnit.findMany({
          where: {
            productId: product.id,
          },
          include: {
            unit: true,
          },
        });

        return {
          product,
          units,
        };
      }

      return {
        product,
        units: [],
      };
    });
  }

  // READ - Lấy tất cả sản phẩm
  static async getAll(ownerId) {
    const db = prisma(ownerId);
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        units: true,
      },
    });

    return products;
  }

  // READ - Lấy sản phẩm theo ID
  static async getById(id, ownerId) {
    const db = prisma(ownerId);
    const product = await db.product.findFirst({
      where: { id: parseInt(id, 10) },
      include: {
        details: true,
      },
    });

    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    return product;
  }

  // UPDATE - Cập nhật sản phẩm
  static async update(id, data, ownerId) {
    const db = prisma(ownerId);
    const parsedId = parseInt(id, 10);

    const foundProduct = await db.product.findFirst({
      where: { id: parsedId },
    });

    if (!foundProduct) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    // Kiểm tra tên trùng lặp nếu tên thay đổi
    if (data.name && data.name !== foundProduct.name) {
      const existingProduct = await db.product.findFirst({
        where: {
          name: data.name,
        },
      });
      if (existingProduct) {
        throw new ApiError(400, "Tên sản phẩm đã tồn tại");
      }
    }

    return await db.product.update({
      where: { id: parsedId },
      data: {
        name: data.name,
        price: data.price ? parseFloat(data.price) : undefined,
      },
    });
  }

  // DELETE - Xóa mềm sản phẩm (soft delete)
  static async delete(id, ownerId) {
    const db = prisma(ownerId);
    const parsedId = parseInt(id, 10);

    const foundProduct = await db.product.findFirst({
      where: { id: parsedId },
    });

    if (!foundProduct) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    return await db.product.update({
      where: { id: parsedId },
      data: {
        isDeleted: true,
      },
    });
  }

  // Cập nhật đơn vị tính của sản phẩm (xóa tất cả cũ, thêm các cái mới)
  static async updateUnits(productId, unitIds, ownerId) {
    const db = prisma(ownerId);
    const parsedProductId = parseInt(productId, 10);

    // Kiểm tra sản phẩm tồn tại
    const product = await db.product.findFirst({
      where: { id: parsedProductId },
    });

    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    // Kiểm tra tất cả đơn vị tính tồn tại
    const units = await db.unit.findMany({
      where: {
        id: {
          in: unitIds,
        },
      },
    });

    if (units.length !== unitIds.length) {
      throw new ApiError(400, "Một hoặc nhiều đơn vị tính không tồn tại");
    }

    // Sử dụng transaction để đảm bảo tính nhất quán
    return await db.$transaction(async (tx) => {
      // Xóa tất cả đơn vị tính cũ
      await tx.productUnit.deleteMany({
        where: {
          productId: parsedProductId,
        },
      });

      // Thêm các đơn vị tính mới
      const createdLinks = await tx.productUnit.createMany({
        data: unitIds.map((unitId) => ({
          productId: parsedProductId,
          unitId: parseInt(unitId, 10),
        })),
      });

      // Lấy danh sách đơn vị tính mới
      return await tx.productUnit.findMany({
        where: {
          productId: parsedProductId,
        },
        include: {
          unit: true,
        },
      });
    });
  }

  // Lấy danh sách đơn vị tính của sản phẩm
  static async getUnits(productId, ownerId) {
    const db = prisma(ownerId);
    const parsedProductId = parseInt(productId, 10);

    const product = await db.product.findFirst({
      where: { id: parsedProductId },
    });

    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    return await db.productUnit.findMany({
      where: {
        productId: parsedProductId,
      },
      include: {
        unit: true,
      },
    });
  }
}
