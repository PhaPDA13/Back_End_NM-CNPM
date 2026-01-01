import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema } from "../validators/user.validator.js";
import { createLoginSchema } from "../validators/login.validator.js";
import { refreshTokenCookieSchema } from "../validators/refresh.validator.js";
import { createUser, login, refresh, logout } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/", validate(createUserSchema), createUser);
router.post("/login", validate(createLoginSchema), login);
router.post("/refresh", validate(refreshTokenCookieSchema, "cookies"), refresh);
router.post("/logout", logout);

export default router;
