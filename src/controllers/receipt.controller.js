import { ReceiptService } from "../services/receipt.service.js";

export const createReceipt = async (req, res, next) => {
  try {
    const createdReceipt = await ReceiptService.create(req.body, req.user.id);
    res.json({
      success: true,
      message: "Create receipt",
      data: createdReceipt,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllReceipts = async (req, res, next) => {
  try {
    const receipts = await ReceiptService.getAll(req.user.id);
    res.json({
      success: true,
      message: "Get all receipts",
      data: receipts,
    });
  } catch (err) {
    next(err);
  }
};

export const getReceiptById = async (req, res, next) => {
  try {
    const receiptId = parseInt(req.params.id, 10);
    const foundReceipt = await ReceiptService.getById(receiptId, req.user.id);
    res.json({
      success: true,
      message: "Get receipt by id",
      data: foundReceipt,
    });
  } catch (err) {
    next(err);
  }
};
