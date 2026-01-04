import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductUnits,
} from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";

const router = express.Router();

router.post("/", validate(createProductSchema), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/:id/units", getProductUnits);
router.put("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
