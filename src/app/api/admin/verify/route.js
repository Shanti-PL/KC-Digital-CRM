import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No admin token found" },
        { status: 401 }
      );
    }

    try {
      // Verify and decode the JWT token
      const decoded = jwt.verify(token.value, JWT_SECRET);

      // Check if it's an admin token
      if (!decoded.isAdmin || decoded.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Not an admin token" },
          { status: 403 }
        );
      }

      // Return admin information
      return NextResponse.json({
        success: true,
        admin: {
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          isAdmin: decoded.isAdmin,
        },
      });
    } catch (jwtError) {
      // Token is invalid or expired
      return NextResponse.json(
        { success: false, error: "Invalid or expired admin token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin token verification error:", error);
    return NextResponse.json(
      { success: false, error: "Admin token verification failed" },
      { status: 500 }
    );
  }
}
