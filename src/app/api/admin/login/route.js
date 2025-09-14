import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// 固定的管理员凭据 - 在生产环境中应该使用环境变量
const ADMIN_CREDENTIALS = {
  username: "kc-admin",
  password: "kcdm14925",
};

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // 验证管理员凭据
    if (
      username !== ADMIN_CREDENTIALS.username ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // 创建管理员JWT令牌
    const token = jwt.sign(
      {
        userId: "admin",
        username: ADMIN_CREDENTIALS.username,
        role: "admin",
        isAdmin: true,
      },
      JWT_SECRET,
      { expiresIn: "24h" } // 管理员会话24小时
    );

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
      user: {
        id: "admin",
        username: ADMIN_CREDENTIALS.username,
        role: "admin",
        isAdmin: true,
      },
      token,
    });

    // 设置HTTP-only cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Admin login failed" },
      { status: 500 }
    );
  }
}
