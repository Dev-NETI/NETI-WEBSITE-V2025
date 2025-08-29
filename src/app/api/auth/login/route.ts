import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, LoginCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();

    // Validate input
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Authenticate admin
    const result = await authenticateAdmin({ email, password });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 401 }
      );
    }

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: result.message,
      admin: result.admin,
    });

    // Set secure httpOnly cookie for token
    response.cookies.set("auth-token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}