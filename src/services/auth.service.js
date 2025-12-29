import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError.js";

dotenv.config();

export class AuthService {
	static async create(data) {
		const existingUserName = await prisma.nhan_vien.findUnique({
			where: { username: data.username },
		});

		const existingEmail = await prisma.nhan_vien.findUnique({
			where: { email: data.email },
		});

		if (existingUserName || existingEmail) {
			throw new ApiError(400, "Username or email already exist");
		}

		const hashRounds = 10;
		const hashedPassword = await bcrypt.hash(data.mat_khau, hashRounds);

		return await prisma.nhan_vien.create({
			data: {
				ten_nhan_vien: data.ten_nhan_vien,
				email: data.email,
				username: data.username,
				mat_khau: hashedPassword,
			},
		});
	}

	static async auth(data) {
		const { username, password } = data;

		const foundUser = await prisma.nhan_vien.findUnique({
			where: {
				username: username,
			},
		});

		if (!foundUser) {
			throw new ApiError(404, "Incorrect username or password");
		}

		const match = await bcrypt.compare(password, foundUser.mat_khau);
		if (!match) {
			throw new ApiError(400, "Incorrect username or password");
		}

		const accessToken = jwt.sign(
			{
				id: foundUser.ma_nhan_vien,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "30m" }
		);

		const refreshToken = jwt.sign(
			{
				id: foundUser.ma_nhan_vien,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		await prisma.refresh_token.create({
			data: {
				user_id: foundUser.ma_nhan_vien,
				token: refreshToken,
				expires_at: expiresAt,
			},
		});

		return { accessToken, refreshToken };
	}

	static async refresh(refreshToken) {
		const payload = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		const tokenInDb = await prisma.refresh_token.findFirst({
			where: {
				token: refreshToken,
				is_revoked: false,
				expires_at: { gt: new Date() },
			},
		});

		if (!tokenInDb) {
			throw new ApiError(400, "Token not found");
		}

		const newAccessToken = jwt.sign(
			{ id: payload.id },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "30m" }
		);

		return newAccessToken;
	}

	static async logout(refreshToken) {
		if (!refreshToken) {
			throw new ApiError(400, "Refresh token is required");
		}

		// Xóa refresh token khỏi DB
		await prisma.refresh_token.deleteMany({
			where: { token: refreshToken },
		});

		return true;
	}
}
