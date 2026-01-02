import { DistrictService } from "../services/district.service.js";

export const createDistrict = async (req, res, next) => {
  try {
    const createdDistrict = await DistrictService.create(req.body);
    res.json({
      success: true,
      message: "Create district",
      data: createdDistrict,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllDistricts = async (req, res, next) => {
  try {
    const districts = await DistrictService.getAll();
    res.json({
      success: true,
      message: "Get all districts",
      data: districts,
    });
  } catch (err) {
    next(err);
  }
};

export const getDistrictById = async (req, res, next) => {
  try {
    const districtId = parseInt(req.params.id, 10);
    const foundDistrict = await DistrictService.getById(districtId);
    res.json({
      success: true,
      message: "Get district by id",
      data: foundDistrict,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDistrict = async (req, res, next) => {
  try {
    const districtId = req.params.id;
    const updatedDistrict = await DistrictService.update(districtId, req.body);
    res.json({
      success: true,
      message: "Update district",
      data: updatedDistrict,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDistrict = async (req, res, next) => {
  try {
    const districtId = req.params.id;
    await DistrictService.delete(districtId);
    res.json({
      success: true,
      message: "Delete district",
    });
  } catch (err) {
    next(err);
  }
};
