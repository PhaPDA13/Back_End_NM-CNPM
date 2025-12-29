import Joi from "joi";

export const createNhanVienSchema = Joi.object({
  ten_nhan_vien: Joi.string()
    .max(100)
    .min(3)
    .required()
    .messages({
      "string.empty": "Tên nhân viên không được để trống",
      "any.required": "Thiếu tên nhân viên"
    }),

  email: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      "string.email": "Email không hợp lệ",
      "any.required": "Thiếu email"
    }),

  username: Joi.string()
    .max(100)
    .required()
    .messages({
      "any.required": "Thiếu username"
    }),

  mat_khau: Joi.string()
    .min(6)
    .max(255)
    .required()
    .messages({
      "string.min": "Mật khẩu tối thiểu 6 ký tự",
      "any.required": "Thiếu mật khẩu"
    }),

  vai_tro: Joi.string()
    .valid("KeToan", "QuanLy", "Admin")
    .default("KeToan")
});
