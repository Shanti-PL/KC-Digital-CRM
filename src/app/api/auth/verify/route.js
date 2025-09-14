import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token found" },
        { status: 401 }
      );
    }

    try {
      // Verify and decode the JWT token
      const decoded = jwt.verify(token.value, JWT_SECRET);

      // Return user information
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.userId,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
        },
      });
    } catch (jwtError) {
      // Token is invalid or expired
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, error: "Token verification failed" },
      { status: 500 }
    );
  }
}
