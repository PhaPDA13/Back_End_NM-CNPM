// validators/hoSoDaiLy.update.validator.js
import Joi from "joi";

export const updateAgentSchema = Joi.object({
  name: Joi.string().max(45),
  phone: Joi.string().pattern(/^[0-9]{9,15}$/),
  address: Joi.string().max(100),
  email: Joi.string().email().max(45),
  debtAmount: Joi.number().precision(2).min(0),
  districtId: Joi.number().integer().positive(),
  agentTypeId: Joi.number().integer().positive(),
})
  .min(1)
  .unknown(false); // không cho phép truyền field ngoài schema
