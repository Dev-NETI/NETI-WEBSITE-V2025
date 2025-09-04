import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API_URL = `${process.env.NEXT_PUBLIC_LARAVEL_BASE_URL}/api`;

// GET /api/news - Get all news articles (proxy to Laravel with auth)
export async function GET(request: NextRequest) {
  try {
    // Get the Laravel Sanctum token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authentication required - no bearer token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const response = await fetch(
      `${LARAVEL_API_URL}/news${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("News GET proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news articles" },
      { status: 500 }
    );
  }
}

// POST /api/news - Create new news article (proxy to Laravel with auth)
export async function POST(request: NextRequest) {
  try {
    // Get the Laravel Sanctum token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authentication required - no bearer token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Forward the request to Laravel with the same token
    const formData = await request.formData();

    const response = await fetch(`${LARAVEL_API_URL}/news`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData, // Forward the FormData as-is for file upload
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("News POST proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
