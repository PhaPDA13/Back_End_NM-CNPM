import { UnitService } from "../services/unit.service.js";

export const createUnit = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const createdUnit = await UnitService.create(req.body, ownerId);
    res.json({
      success: true,
      message: "Create unit",
      data: createdUnit,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUnits = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const units = await UnitService.getAll(ownerId);
    res.json({
      success: true,
      message: "Get all units",
      data: units,
    });
  } catch (err) {
    next(err);
  }
};

export const getUnitById = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const unitId = parseInt(req.params.id, 10);
    const foundUnit = await UnitService.getById(unitId, ownerId);
    res.json({
      success: true,
      message: "Get unit by id",
      data: foundUnit,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUnit = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const unitId = req.params.id;
    const updatedUnit = await UnitService.update(unitId, req.body, ownerId);
    res.json({
      success: true,
      message: "Update unit",
      data: updatedUnit,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUnit = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const unitId = req.params.id;
    await UnitService.delete(unitId, ownerId);
    res.json({
      success: true,
      message: "Delete unit",
    });
  } catch (err) {
    next(err);
  }
};
