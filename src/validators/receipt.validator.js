import Joi from "joi";

export const createReceiptSchema = Joi.object({
  payDate: Joi.date().required(),
  amount: Joi.number().positive().required(),
  agentId: Joi.number().positive().required(),
});
