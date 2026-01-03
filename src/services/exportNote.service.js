import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class ExportNoteService {
  // CREATE - Lập phiếu xuất hàng
  static async create(data, ownerId) {
    const db = prisma(ownerId);

    // Sử dụng transaction để đảm bảo tính nhất quán dữ liệu
    return await db.$transaction(async (tx) => {
      // Parse và validate dữ liệu từ request
      const agentId = parseInt(data.agentId, 10);

      // Kiểm tra agent tồn tại
      const agent = await tx.agent.findUnique({
        where: { id: agentId },
        include: { agentType: true },
      });

      if (!agent) {
        throw new ApiError(404, "Không tìm thấy đại lý");
      }

      // Kiểm tra details không rỗng
      if (!data.details || data.details.length === 0) {
        throw new ApiError(400, "Phiếu xuất phải có ít nhất một mặt hàng");
      }

      // Lấy các sản phẩm được phép cho loại đại lý này
      const allowedProducts = await prisma().agentTypeProduct.findMany({
        where: {
          agentTypeId: agent.agentTypeId,
        },
        select: {
          productId: true,
        },
      });

      const allowedProductIds = new Set(allowedProducts.map((ap) => ap.productId));

      // Lấy thông tin tất cả sản phẩm và đơn vị tính cần dùng
      const productIds = data.details.map((d) => parseInt(d.productId, 10));
      const unitIds = data.details.map((d) => parseInt(d.unitId, 10));

      const products = await prisma().product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      const units = await prisma().unit.findMany({
        where: {
          id: { in: unitIds },
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));
      const unitMap = new Map(units.map((u) => [u.id, u]));

      // Kiểm tra sản phẩm, unit tồn tại, được phép cho đại lý và tính tổng tiền
      let total = 0;
      const detailsData = [];

      for (const detail of data.details) {
        const productId = parseInt(detail.productId, 10);
        const unitId = parseInt(detail.unitId, 10);
        const quantity = parseInt(detail.quantity, 10);
        const price = parseFloat(detail.price);

        const product = productMap.get(productId);
        if (!product) {
          throw new ApiError(400, `Sản phẩm ID ${productId} không tồn tại`);
        }

        const unit = unitMap.get(unitId);
        if (!unit) {
          throw new ApiError(400, `Đơn vị tính ID ${unitId} không tồn tại`);
        }

        // Kiểm tra sản phẩm có được phép xuất cho loại đại lý này không
        if (!allowedProductIds.has(productId)) {
          throw new ApiError(
            400,
            `Sản phẩm "${product.name}" không được phép xuất cho loại đại lý "${agent.agentType.name}"`
          );
        }

        // Tính amount = quantity * price
        const amount = quantity * price;
        total += amount;

        detailsData.push({
          productId,
          unitId,
          quantity,
          price,
          amount,
        });
      }

      // QĐ2: Kiểm tra tổng nợ sau xuất ≤ nợ tối đa
      const debtAfterExport = agent.debtAmount + total;
      if (debtAfterExport > agent.agentType.maxDebt) {
        throw new ApiError(
          400,
          `Tổng nợ sau xuất (${debtAfterExport}) vượt quá giới hạn nợ (${agent.agentType.maxDebt})`
        );
      }

      // Tạo phiếu xuất
      const exportNote = await tx.exportNote.create({
        data: {
          issueDate: new Date(data.issueDate),
          agentId,
          total,
          details: {
            createMany: {
              data: detailsData,
            },
          },
        },
        include: {
          agent: true,
          details: {
            include: {
              product: true,
              unit: true,
            },
          },
        },
      });

      // Cập nhật debtAmount của đại lý
      const newDebtAmount = agent.debtAmount + total;
      await tx.agent.update({
        where: { id: agentId },
        data: {
          debtAmount: newDebtAmount,
        },
      });

      return exportNote;
    });
  }

  // READ - Danh sách phiếu xuất
  static async getAll(ownerId) {
    const exportNotes = await prisma(ownerId).exportNote.findMany({
      select: {
        id: true,
        issueDate: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        agent: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        issueDate: "desc",
      },
    });

    return exportNotes;
  }

  // READ - Chi tiết phiếu xuất
  static async getById(id, ownerId) {
    const exportNote = await prisma(ownerId).exportNote.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        agent: {
          include: {
            agentType: true,
            district: true,
          },
        },
        details: {
          include: {
            product: true,
            unit: true,
          },
        },
      },
    });

    if (!exportNote) {
      throw new ApiError(404, "Không tìm thấy phiếu xuất");
    }

    return exportNote;
  }
}
