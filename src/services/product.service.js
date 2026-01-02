import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class ProductService {
  // CREATE - Tạo sản phẩm mới
  static async create(data) {
    const foundProduct = await prisma().product.findUnique({
      where: {
        name: data.name,
      },
    });

    if (foundProduct) {
      throw new ApiError(400, "Sản phẩm đã tồn tại");
    }

    return await prisma().product.create({
      data: {
        name: data.name,
        price: parseFloat(data.price),
      },
    });
  }

  // READ - Lấy tất cả sản phẩm
  static async getAll() {
    const products = await prisma().product.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    return products;
  }

  // READ - Lấy sản phẩm theo ID
  static async getById(id) {
    const product = await prisma().product.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        details: true,
      },
    });

    if (!product || product.isDeleted) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    return product;
  }

  // UPDATE - Cập nhật sản phẩm
  static async update(id, data) {
    const parsedId = parseInt(id, 10);

    const foundProduct = await prisma().product.findUnique({
      where: { id: parsedId },
    });

    if (!foundProduct || foundProduct.isDeleted) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    // Kiểm tra tên trùng lặp nếu tên thay đổi
    if (data.name && data.name !== foundProduct.name) {
      const existingProduct = await prisma().product.findFirst({
        where: {
          name: data.name,
          isDeleted: false,
        },
      });
      if (existingProduct) {
        throw new ApiError(400, "Tên sản phẩm đã tồn tại");
      }
    }

    return await prisma().product.update({
      where: { id: parsedId },
      data: {
        name: data.name,
        price: data.price ? parseFloat(data.price) : undefined,
      },
    });
  }

  // DELETE - Xóa mềm sản phẩm (soft delete)
  static async delete(id) {
    const parsedId = parseInt(id, 10);

    const foundProduct = await prisma().product.findUnique({
      where: { id: parsedId },
    });

    if (!foundProduct || foundProduct.isDeleted) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    return await prisma().product.update({
      where: { id: parsedId },
      data: {
        isDeleted: true,
      },
    });
  }
}
