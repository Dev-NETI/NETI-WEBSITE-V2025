import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "No authentication token",
        },
        { status: 401 }
      );
    }

    // Verify token and get admin
    const admin = await verifyToken(token);

    if (!admin) {
      // Invalid or expired token
      const response = NextResponse.json(
        {
          success: false,
          error: "Invalid or expired token",
        },
        { status: 401 }
      );

      // Clear the invalid cookie
      response.cookies.set("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });

      return response;
    }

    // Return admin info (without password)
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Authentication verification failed",
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}