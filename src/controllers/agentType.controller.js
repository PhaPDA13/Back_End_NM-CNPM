import { AgentTypeService } from "../services/agentType.service.js";

export const createAgentType = async (req, res, next) => {
  try {
    const createdType = await AgentTypeService.create(req.body);
    res.json({
      success: true,
      message: "Create agent type",
      data: createdType,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAgentTypes = async (req, res, next) => {
  try {
    const types = await AgentTypeService.getAll();
    res.json({
      success: true,
      message: "Get all agent types",
      data: types,
    });
  } catch (err) {
    next(err);
  }
};

export const getAgentTypeById = async (req, res, next) => {
  try {
    const typeId = parseInt(req.params.id, 10);
    const foundType = await AgentTypeService.getById(typeId);
    res.json({
      success: true,
      message: "Get agent type by id",
      data: foundType,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAgentType = async (req, res, next) => {
  try {
    const typeId = req.params.id;
    const updatedType = await AgentTypeService.update(typeId, req.body);
    res.json({
      success: true,
      message: "Update agent type",
      data: updatedType,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAgentType = async (req, res, next) => {
  try {
    const typeId = req.params.id;
    await AgentTypeService.delete(typeId);
    res.json({
      success: true,
      message: "Delete agent type",
    });
  } catch (err) {
    next(err);
  }
};
