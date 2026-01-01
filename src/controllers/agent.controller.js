import { AgentService } from "../services/agent.service.js";

export const createAgent = async (req, res, next) => {
  try {
    const createdAgent = await AgentService.create(req.body, req.user.id);
    res.json({
      success: true,
      message: "Create agent",
      data: createdAgent,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAgents = async (req, res, next) => {
  try {
    const agents = await AgentService.getAll(req.user.id);
    res.json({
      success: true,
      message: "Get all agents from database",
      data: agents,
    });
  } catch (err) {
    next(err);
  }
};

export const getAgentById = async (req, res, next) => {
  try {
    const agentId = parseInt(req.params.id, 10);
    const foundAgent = await AgentService.getById(agentId, req.user.id);
    res.json({
      success: true,
      message: "Get agent by id",
      data: foundAgent,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAgent = async (req, res, next) => {
  try {
    const agentId = req.params.id;
    const updatedAgent = await AgentService.update(agentId, req.body, req.user.id);
    res.json({
      success: true,
      message: "Update agent",
      data: updatedAgent,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const agentId = req.params.id;
    await AgentService.deleteAgent(agentId, req.user.id);
    res.json({
      success: true,
      message: "Delete agent",
    });
  } catch (err) {
    next(err);
  }
};

export const searchAgent = async (req, res, next) => {
  try {
    const agents = await AgentService.search(req.query, req.user.id);
    res.json({
      success: true,
      message: "Search agents",
      data: agents,
    });
  } catch (err) {
    next(err);
  }
};
