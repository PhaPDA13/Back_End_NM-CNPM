import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export class ReportService {
  // Báo cáo doanh số theo tháng
  static async getSalesReport(month, year) {
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

    // Lấy tất cả đại lý chưa bị xóa
    const agents = await prisma().agent.findMany({
      where: {
        isDeleted: false,
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

    // Lấy tổng doanh số toàn bộ trong tháng
    const totalRevenueResult = await prisma().exportNote.aggregate({
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

    // Lấy doanh số từng đại lý
    const salesData = await Promise.all(
      agents.map(async (agent) => {
        const agentSales = await prisma().exportNote.aggregate({
          _sum: {
            total: true,
          },
          _count: true,
          where: {
            agentId: agent.id,
            issueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const agentRevenue = agentSales._sum.total || 0;
        const billCount = agentSales._count || 0;
        const percentage = totalRevenue > 0 ? ((agentRevenue / totalRevenue) * 100).toFixed(2) : 0;

        return {
          agentId: agent.id,
          agentName: agent.name,
          billCount: billCount,
          totalRevenue: parseFloat(agentRevenue.toString()),
          percentage: parseFloat(percentage),
        };
      })
    );

    return {
      month: month_int,
      year: year_int,
      totalRevenue: parseFloat(totalRevenue.toString()),
      salesData: salesData.filter((item) => item.billCount > 0 || item.totalRevenue > 0),
    };
  }

  // Báo cáo công nợ theo tháng
  static async getDebtReport(month, year) {
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

    // Lấy tất cả đại lý chưa bị xóa
    const agents = await prisma().agent.findMany({
      where: {
        isDeleted: false,
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
        const issueResult = await prisma().exportNote.aggregate({
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
        const paymentResult = await prisma().receipt.aggregate({
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

        // Nợ đầu kỳ = nợ cuối kỳ tháng trước
        // Nợ cuối kỳ = nợ hiện tại (debtAmount)
        // Nợ đầu kỳ = nợ cuối kỳ - phát sinh + thanh toán
        const beginningDebt = agent.debtAmount - issuedDebt + payment;

        return {
          agentId: agent.id,
          agentName: agent.name,
          beginningDebt: parseFloat(Math.max(0, beginningDebt).toString()),
          issuedDebt: parseFloat(issuedDebt.toString()),
          payment: parseFloat(payment.toString()),
          endingDebt: parseFloat(agent.debtAmount.toString()),
        };
      })
    );

    return {
      month: month_int,
      year: year_int,
      debtData: debtData.filter(
        (item) => item.beginningDebt > 0 || item.issuedDebt > 0 || item.endingDebt > 0
      ),
    };
  }

  // Báo cáo tổng hợp (kết hợp cả doanh số và công nợ)
  static async getSummaryReport(month, year) {
    const salesReport = await this.getSalesReport(month, year);
    const debtReport = await this.getDebtReport(month, year);

    return {
      month: parseInt(month, 10),
      year: parseInt(year, 10),
      salesReport,
      debtReport,
    };
  }
}
