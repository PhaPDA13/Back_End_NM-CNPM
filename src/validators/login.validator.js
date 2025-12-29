import Joi from "joi";

export const createLoginSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.min": "Username phải ít nhất 3 ký tự",
      "string.max": "Username tối đa 100 ký tự",
      "string.base": "Username không hợp lệ"
    }),

  password: Joi.string()
    .min(6)
    .max(255)
    .required()
    .messages({
      "any.required": "Mật khẩu là bắt buộc",
      "string.min": "Mật khẩu phải ít nhất 6 ký tự"
    })
})
  // Không cho truyền field dư
  .unknown(false);
