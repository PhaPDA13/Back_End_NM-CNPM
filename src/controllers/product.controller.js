import { ProductService } from "../services/product.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const result = await ProductService.create(req.body, ownerId);
    res.json({
      success: true,
      message: "Create product",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const products = await ProductService.getAll(ownerId);
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
    const ownerId = req.user.id;
    const productId = parseInt(req.params.id, 10);
    const foundProduct = await ProductService.getById(productId, ownerId);
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
    const ownerId = req.user.id;
    const productId = req.params.id;
    const { name, price, unitIds, agentTypeIds } = req.body;

    // Cập nhật thông tin sản phẩm
    const updatedProduct = await ProductService.update(productId, { name, price }, ownerId);

    // Nếu có unitIds, cập nhật đơn vị tính
    let units = null;
    if (unitIds && Array.isArray(unitIds)) {
      units = await ProductService.updateUnits(productId, unitIds, ownerId);
    }

    // Nếu có agentTypeIds, cập nhật loại đại lý
    let agentTypes = null;
    if (agentTypeIds && Array.isArray(agentTypeIds)) {
      agentTypes = await ProductService.updateAgentTypes(productId, agentTypeIds, ownerId);
    }

    res.json({
      success: true,
      message: "Update product",
      data: {
        product: updatedProduct,
        units: units,
        agentTypes: agentTypes,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const productId = req.params.id;
    await ProductService.delete(productId, ownerId);
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
    const ownerId = req.user.id;
    const productId = req.params.id;
    const units = await ProductService.getUnits(productId, ownerId);
    res.json({
      success: true,
      message: "Get product units",
      data: units,
    });
  } catch (err) {
    next(err);
  }
};
