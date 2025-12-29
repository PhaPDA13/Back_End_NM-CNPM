import Joi from "joi";

export const refreshTokenCookieSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Thiếu refresh token cookie",
  }),
});
