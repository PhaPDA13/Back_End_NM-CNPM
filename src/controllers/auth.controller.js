import { AuthService } from "../services/auth.service.js";

//Create user account controller
export const createUser = async (req, res, next) => {
  try {
    const result = await AuthService.create(req.body);
    res.status(201).json({
      success: true,
      mesage: `User ${result.username} created`,
    });
  } catch (err) {
    next(err);
  }
};

//Login controller
export const login = async (req, res, next) => {
  try {
    const result = await AuthService.auth(req.body);
    const { accessToken, refreshToken } = result;

    if (!result) {
      throw new Error("Internal server error");
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

//Refresh token controller
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const newAccessToken = await AuthService.refresh(refreshToken);
    res.json({
      success: true,
      message: "Refresh token successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

//Logout controller
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
