import Joi from "joi";

export const createDistrictSchema = Joi.object({
  name: Joi.string().max(100).required(),
  maxAgents: Joi.number().positive(),
});

export const updateDistrictSchema = Joi.object({
  name: Joi.string().max(100),
  maxAgents: Joi.number().positive(),
});
