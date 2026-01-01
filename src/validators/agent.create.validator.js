// validators/hoSoDaiLy.create.validator.js
import Joi from "joi";

export const createAgentSchema = Joi.object({
  name: Joi.string().max(45).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{9,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Số điện thoại không hợp lệ",
    }),

  address: Joi.string().max(100).required(),

  email: Joi.string().email().max(45).required(),

  districtId: Joi.number().integer().positive().required(),

  agentTypeId: Joi.number().integer().positive().required(),
});
