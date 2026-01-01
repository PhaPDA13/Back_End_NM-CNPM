import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class UnitService {
  // CREATE - Tạo đơn vị tính mới
  static async create(data) {
    const foundUnit = await prisma().unit.findUnique({
      where: {
        name: data.name,
      },
    });

    if (foundUnit) {
      throw new ApiError(400, "Đơn vị tính đã tồn tại");
    }

    return await prisma().unit.create({
      data: {
        name: data.name,
      },
    });
  }

  // READ - Lấy tất cả đơn vị tính
  static async getAll() {
    const units = await prisma().unit.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return units;
  }

  // READ - Lấy đơn vị tính theo ID
  static async getById(id) {
    const unit = await prisma().unit.findUnique({
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
  static async update(id, data) {
    const parsedId = parseInt(id, 10);

    const foundUnit = await prisma().unit.findUnique({
      where: { id: parsedId },
    });

    if (!foundUnit) {
      throw new ApiError(404, "Không tìm thấy đơn vị tính");
    }

    // Kiểm tra tên trùng lặp nếu tên thay đổi
    if (data.name && data.name !== foundUnit.name) {
      const existingUnit = await prisma().unit.findUnique({
        where: { name: data.name },
      });
      if (existingUnit) {
        throw new ApiError(400, "Tên đơn vị tính đã tồn tại");
      }
    }

    return await prisma().unit.update({
      where: { id: parsedId },
      data: {
        name: data.name,
      },
    });
  }

  // DELETE - Xóa đơn vị tính
  static async delete(id) {
    const parsedId = parseInt(id, 10);

    const foundUnit = await prisma().unit.findUnique({
      where: { id: parsedId },
    });

    if (!foundUnit) {
      throw new ApiError(404, "Không tìm thấy đơn vị tính");
    }

    // Kiểm tra đơn vị tính có được sử dụng không
    const detailCount = await prisma().exportNoteDetail.count({
      where: { unitId: parsedId },
    });

    if (detailCount > 0) {
      throw new ApiError(400, "Không thể xóa đơn vị tính đang được sử dụng");
    }

    return await prisma().unit.delete({
      where: { id: parsedId },
    });
  }
}
