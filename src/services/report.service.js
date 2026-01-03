import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class ReportService {
  // Báo cáo doanh số theo tháng
  static async getSalesReport(month, year, ownerId) {
    const year_int = parseInt(year, 10);
    const month_int = parseInt(month, 10);

    if (month_int < 1 || month_int > 12) {
      throw new ApiError(400, "Tháng không hợp lệ");
    }

    // Kiểm tra tháng/năm không được trong tương lai
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year_int > currentYear || (year_int === currentYear && month_int > currentMonth)) {
      throw new ApiError(400, "Không thể lấy báo cáo cho tháng trong tương lai");
    }

    // Lấy ngày bắt đầu và kết thúc của tháng
    const startDate = new Date(year_int, month_int - 1, 1);
    const endDate = new Date(year_int, month_int, 0);

    const db = prisma(ownerId);

    // Lấy tổng doanh số toàn bộ trong tháng
    const totalRevenueResult = await db.exportNote.aggregate({
      _sum: {
        total: true,
      },
      where: {
        issueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRevenue = totalRevenueResult._sum.total || 0;

    // Lấy danh sách đại lý có doanh số trong tháng
    const agentSalesGroups = await db.exportNote.groupBy({
      by: ["agentId"],
      _sum: {
        total: true,
      },
      _count: true,
      where: {
        issueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        agentId: "asc",
      },
    });

    // Lấy thông tin đại lý có doanh số
    const agents = await db.agent.findMany({
      where: {
        id: {
          in: agentSalesGroups.map((group) => group.agentId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Tạo map để lookup thông tin đại lý
    const agentMap = new Map(agents.map((agent) => [agent.id, agent]));

    // Xây dựng salesData từ các đại lý có doanh số
    const salesData = agentSalesGroups
      .map((group) => {
        const agent = agentMap.get(group.agentId);
        if (!agent) return null;

        const agentRevenue = group._sum.total || 0;
        const billCount = group._count || 0;
        const percentage = totalRevenue > 0 ? ((agentRevenue / totalRevenue) * 100).toFixed(2) : 0;

        return {
          agentId: agent.id,
          agentName: agent.name,
          billCount: billCount,
          totalRevenue: parseFloat(agentRevenue.toString()),
          percentage: parseFloat(percentage),
        };
      })
      .filter((item) => item !== null);

    return {
      month: month_int,
      year: year_int,
      totalRevenue: parseFloat(totalRevenue.toString()),
      salesData: salesData,
    };
  }

  // Báo cáo công nợ theo tháng
  static async getDebtReport(month, year, ownerId) {
    const year_int = parseInt(year, 10);
    const month_int = parseInt(month, 10);

    if (month_int < 1 || month_int > 12) {
      throw new ApiError(400, "Tháng không hợp lệ");
    }

    // Kiểm tra tháng/năm không được trong tương lai
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year_int > currentYear || (year_int === currentYear && month_int > currentMonth)) {
      throw new ApiError(400, "Không thể lấy báo cáo cho tháng trong tương lai");
    }

    // Lấy ngày bắt đầu và kết thúc của tháng
    const startDate = new Date(year_int, month_int - 1, 1);
    const endDate = new Date(year_int, month_int, 0);

    const db = prisma(ownerId);

    // Lấy danh sách đại lý có phát sinh nợ hoặc thanh toán trong tháng
    const agentIdsWithDebt = await db.exportNote.findMany({
      where: {
        issueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        agentId: true,
      },
      distinct: ["agentId"],
    });

    const agentIdsWithPayment = await db.receipt.findMany({
      where: {
        payDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        agentId: true,
      },
      distinct: ["agentId"],
    });

    // Gộp lại danh sách đại lý duy nhất
    const agentIdsSet = new Set([
      ...agentIdsWithDebt.map((item) => item.agentId),
      ...agentIdsWithPayment.map((item) => item.agentId),
    ]);

    // Lấy thông tin đại lý cần lấy báo cáo
    const agents = await db.agent.findMany({
      where: {
        id: {
          in: Array.from(agentIdsSet),
        },
      },
      select: {
        id: true,
        name: true,
        debtAmount: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    // Tính công nợ từng đại lý
    const debtData = await Promise.all(
      agents.map(async (agent) => {
        // Phát sinh nợ = tổng xuất hàng trong tháng
        const issueResult = await db.exportNote.aggregate({
          _sum: {
            total: true,
          },
          where: {
            agentId: agent.id,
            issueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const issuedDebt = issueResult._sum.total || 0;

        // Thanh toán = tổng tiền thu trong tháng
        const paymentResult = await db.receipt.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            agentId: agent.id,
            payDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const payment = paymentResult._sum.amount || 0;

        // Nợ đầu kỳ = Tổng tất cả phiếu xuất trước tháng - tổng tất cả phiếu thu trước tháng
        let beginningDebt = 0;
        const totalExportBeforeMonth = await db.exportNote.aggregate({
          _sum: {
            total: true,
          },
          where: {
            agentId: agent.id,
            issueDate: {
              lt: startDate,
            },
          },
        });

        const totalPaymentBeforeMonth = await db.receipt.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            agentId: agent.id,
            payDate: {
              lt: startDate,
            },
          },
        });

        beginningDebt =
          (totalExportBeforeMonth._sum.total || 0) - (totalPaymentBeforeMonth._sum.amount || 0);

        // Nợ cuối kỳ = remainingDebt của phiếu thu cuối cùng TRONG tháng này
        let endingDebt = beginningDebt + issuedDebt - payment;
        const lastReceiptInMonth = await db.receipt.findFirst({
          where: {
            agentId: agent.id,
            payDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            remainingDebt: true,
          },
          orderBy: {
            payDate: "desc",
          },
        });

        if (lastReceiptInMonth) {
          endingDebt = lastReceiptInMonth.remainingDebt;
        }

        return {
          agentId: agent.id,
          agentName: agent.name,
          beginningDebt: parseFloat(Math.max(0, beginningDebt).toString()),
          issuedDebt: parseFloat(issuedDebt.toString()),
          payment: parseFloat(payment.toString()),
          endingDebt: parseFloat(endingDebt.toString()),
        };
      })
    );

    return {
      month: month_int,
      year: year_int,
      debtData: debtData,
    };
  }

  // Báo cáo tổng hợp (kết hợp cả doanh số và công nợ)
  static async getSummaryReport(month, year, ownerId) {
    const salesReport = await this.getSalesReport(month, year, ownerId);
    const debtReport = await this.getDebtReport(month, year, ownerId);

    return {
      month: parseInt(month, 10),
      year: parseInt(year, 10),
      salesReport,
      debtReport,
    };
  }
}
