import { ReportService } from "../services/report.service.js";

// BM5.1: Báo cáo doanh số
export const getSalesReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const ownerId = req.user.id;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp tháng và năm",
      });
    }

    const report = await ReportService.getSalesReport(month, year, ownerId);
    res.json({
      success: true,
      message: "Báo cáo doanh số (BM5.1)",
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// BM5.2: Báo cáo công nợ
export const getDebtReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const ownerId = req.user.id;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp tháng và năm",
      });
    }

    const report = await ReportService.getDebtReport(month, year, ownerId);
    res.json({
      success: true,
      message: "Báo cáo công nợ (BM5.2)",
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// Báo cáo tổng hợp
export const getSummaryReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const ownerId = req.user.id;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp tháng và năm",
      });
    }

    const report = await ReportService.getSummaryReport(month, year, ownerId);
    res.json({
      success: true,
      message: "Báo cáo tổng hợp",
      data: report,
    });
  } catch (err) {
    next(err);
  }
};
