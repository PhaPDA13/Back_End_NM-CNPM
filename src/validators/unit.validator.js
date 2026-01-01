import Joi from "joi";

export const createUnitSchema = Joi.object({
  name: Joi.string().max(100).required(),
});

export const updateUnitSchema = Joi.object({
  name: Joi.string().max(100),
});
