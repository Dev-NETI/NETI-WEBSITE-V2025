import { NextRequest, NextResponse } from "next/server";
import {
  getNewsById,
  updateNews,
  deleteNews,
  incrementNewsViews,
} from "@/lib/news-db";
import { verifyToken } from "@/lib/auth";
import { hasPermission } from "@/lib/middleware";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/news/[id] - Get specific news article (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const incrementViews = searchParams.get("incrementViews") === "true";

    console.log("News API: Getting news by ID:", id);

    let result;
    if (incrementViews) {
      result = await incrementNewsViews(id);
    } else {
      result = await getNewsById(id);
    }

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "News article not found" },
        { status: result.error === "News article not found" ? 404 : 500 }
      );
    }

    console.log("News API: Found news article:", result.data.title);

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Get news by ID error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - Update news article (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check permissions
    if (!hasPermission(decoded.role, "news_manager")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    console.log("News API: Updating news article:", id);

    const result = await updateNews(id, body);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to update news article",
        },
        { status: result.error === "News article not found" ? 404 : 500 }
      );
    }

    console.log("News API: Updated news article:", result.data.title);

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Update news error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/news/[id] - Delete news article (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check permissions
    if (!hasPermission(decoded.role, "news_manager")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;

    console.log("News API: Deleting news article:", id);

    const result = await deleteNews(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === "News article not found" ? 404 : 500 }
      );
    }

    console.log("News API: Deleted news article:", id);

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
