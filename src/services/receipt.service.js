import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class ReceiptService {
  // CREATE - Lập phiếu thu tiền
  static async create(data, ownerId) {
    const db = prisma(ownerId);

    // Sử dụng transaction để đảm bảo tính nhất quán dữ liệu
    return await db.$transaction(async (tx) => {
      // Kiểm tra agent tồn tại
      const agent = await tx.agent.findUnique({
        where: { id: data.agentId },
      });

      if (!agent) {
        throw new ApiError(404, "Không tìm thấy đại lý");
      }

      // QĐ4: Kiểm tra số tiền thu ≤ tiền đại lý đang nợ
      if (data.amount > agent.debtAmount) {
        throw new ApiError(
          400,
          `Số tiền thu (${data.amount}) không thể vượt quá tiền nợ hiện tại (${agent.debtAmount})`
        );
      }

      // Tạo phiếu thu tiền
      const receipt = await tx.receipt.create({
        data: {
          payDate: new Date(data.payDate),
          amount: parseFloat(data.amount),
          agentId: data.agentId,
        },
        include: {
          agent: true,
        },
      });

      // Cập nhật debtAmount của đại lý (giảm công nợ)
      await tx.agent.update({
        where: { id: data.agentId },
        data: {
          debtAmount: agent.debtAmount - parseFloat(data.amount),
        },
      });

      return receipt;
    });
  }

  // READ - Danh sách phiếu thu
  static async getAll(ownerId) {
    const receipts = await prisma(ownerId).receipt.findMany({
      select: {
        id: true,
        payDate: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        agent: {
          select: {
            id: true,
            name: true,
            phone: true,
            debtAmount: true,
          },
        },
      },
      orderBy: {
        payDate: "desc",
      },
    });

    return receipts;
  }

  // READ - Chi tiết phiếu thu
  static async getById(id, ownerId) {
    const receipt = await prisma(ownerId).receipt.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        agent: {
          include: {
            agentType: true,
            district: true,
          },
        },
      },
    });

    if (!receipt) {
      throw new ApiError(404, "Không tìm thấy phiếu thu");
    }

    return receipt;
  }
}
