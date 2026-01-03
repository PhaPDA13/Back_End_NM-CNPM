import { ProductService } from "../services/product.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await ProductService.create(req.body);
    res.json({
      success: true,
      message: "Create product",
      data: createdProduct,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getAll();
    res.json({
      success: true,
      message: "Get all products",
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const foundProduct = await ProductService.getById(productId);
    res.json({
      success: true,
      message: "Get product by id",
      data: foundProduct,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, price, unitIds } = req.body;

    // Cập nhật thông tin sản phẩm
    const updatedProduct = await ProductService.update(productId, { name, price });

    // Nếu có unitIds, cập nhật đơn vị tính
    let units = null;
    if (unitIds && Array.isArray(unitIds)) {
      units = await ProductService.updateUnits(productId, unitIds);
    }

    res.json({
      success: true,
      message: "Update product",
      data: {
        product: updatedProduct,
        units: units,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    await ProductService.delete(productId);
    res.json({
      success: true,
      message: "Delete product",
    });
  } catch (err) {
    next(err);
  }
};

export const getProductUnits = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const units = await ProductService.getUnits(productId);
    res.json({
      success: true,
      message: "Get product units",
      data: units,
    });
  } catch (err) {
    next(err);
  }
};
