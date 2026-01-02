import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().max(100).required(),
  price: Joi.number().positive().required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().max(100),
  price: Joi.number().positive(),
});
