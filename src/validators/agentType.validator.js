import Joi from "joi";

export const createAgentTypeSchema = Joi.object({
  name: Joi.string().max(100).required(),
  maxDebt: Joi.number().positive().required(),
});

export const updateAgentTypeSchema = Joi.object({
  name: Joi.string().max(100),
  maxDebt: Joi.number().positive(),
});
