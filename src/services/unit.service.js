import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class UnitService {
  // CREATE - Tạo đơn vị tính mới
  static async create(data, ownerId) {
    const db = prisma(ownerId);
    const foundUnit = await db.unit.findUnique({
      where: {
        name: data.name,
      },
    });

    if (foundUnit) {
      throw new ApiError(400, "Đơn vị tính đã tồn tại");
    }

    return await db.unit.create({
      data: {
        name: data.name,
      },
    });
  }

  // READ - Lấy tất cả đơn vị tính
  static async getAll(ownerId) {
    const db = prisma(ownerId);
    const units = await db.unit.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return units;
  }

  // READ - Lấy đơn vị tính theo ID
  static async getById(id, ownerId) {
    const db = prisma(ownerId);
    const unit = await db.unit.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        details: true,
      },
    });

    if (!unit) {
      throw new ApiError(404, "Không tìm thấy đơn vị tính");
    }

    return unit;
  }

  // UPDATE - Cập nhật đơn vị tính
  static async update(id, data, ownerId) {
    const db = prisma(ownerId);
    const parsedId = parseInt(id, 10);

    const foundUnit = await db.unit.findUnique({
      where: { id: parsedId },
    });

    if (!foundUnit) {
      throw new ApiError(404, "Không tìm thấy đơn vị tính");
    }

    // Kiểm tra tên trùng lặp nếu tên thay đổi
    if (data.name && data.name !== foundUnit.name) {
      const existingUnit = await db.unit.findUnique({
        where: { name: data.name },
      });
      if (existingUnit) {
        throw new ApiError(400, "Tên đơn vị tính đã tồn tại");
      }
    }

    return await db.unit.update({
      where: { id: parsedId },
      data: {
        name: data.name,
      },
    });
  }

  // DELETE - Xóa đơn vị tính
  static async delete(id, ownerId) {
    const db = prisma(ownerId);
    const parsedId = parseInt(id, 10);

    const foundUnit = await db.unit.findUnique({
      where: { id: parsedId },
    });

    if (!foundUnit) {
      throw new ApiError(404, "Không tìm thấy đơn vị tính");
    }

    // Kiểm tra đơn vị tính có được sử dụng không
    const detailCount = await db.exportNoteDetail.count({
      where: { unitId: parsedId },
    });

    if (detailCount > 0) {
      throw new ApiError(400, "Không thể xóa đơn vị tính đang được sử dụng");
    }

    return await db.unit.delete({
      where: { id: parsedId },
    });
  }
}
