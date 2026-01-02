import Joi from "joi";

export const createExportNoteSchema = Joi.object({
  issueDate: Joi.date().required(),
  agentId: Joi.number().positive().required(),
  details: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().positive().required(),
        unitId: Joi.number().positive().required(),
        quantity: Joi.number().positive().required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
});
