import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().max(100).required(),
  price: Joi.number().positive().required(),
  unitIds: Joi.array().items(Joi.number().positive()).min(0),
  agentTypeIds: Joi.array().items(Joi.number().positive()).min(0),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().max(100),
  price: Joi.number().positive(),
  unitIds: Joi.array().items(Joi.number().positive()).min(0),
  agentTypeIds: Joi.array().items(Joi.number().positive()).min(0),
});
