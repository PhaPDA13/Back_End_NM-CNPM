import express from "express";
import {
  getSalesReport,
  getDebtReport,
  getSummaryReport,
} from "../controllers/report.controller.js";

const router = express.Router();

// BM5.1: Báo cáo doanh số
router.get("/sales", getSalesReport);

// BM5.2: Báo cáo công nợ
router.get("/debt", getDebtReport);

// Báo cáo tổng hợp
router.get("/summary", getSummaryReport);

export default router;
