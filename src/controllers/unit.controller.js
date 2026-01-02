import { UnitService } from "../services/unit.service.js";

export const createUnit = async (req, res, next) => {
  try {
    const createdUnit = await UnitService.create(req.body);
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
    const units = await UnitService.getAll();
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
    const unitId = parseInt(req.params.id, 10);
    const foundUnit = await UnitService.getById(unitId);
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
    const unitId = req.params.id;
    const updatedUnit = await UnitService.update(unitId, req.body);
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
    const unitId = req.params.id;
    await UnitService.delete(unitId);
    res.json({
      success: true,
      message: "Delete unit",
    });
  } catch (err) {
    next(err);
  }
};
