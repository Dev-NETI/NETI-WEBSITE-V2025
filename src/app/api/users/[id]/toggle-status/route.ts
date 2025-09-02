import { NextRequest, NextResponse } from "next/server";
import { updateUser, getUserByIdForAdmin } from "@/lib/user-db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// PATCH /api/users/[id]/toggle-status - Toggle user active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const admin = await verifyToken(token);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check permissions - only super_admin and user_manager can toggle user status
    if (admin.role !== "super_admin" && admin.role !== "user_manager") {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent toggling own status
    if (admin.id === id) {
      return NextResponse.json(
        { success: false, error: "Cannot change your own status" },
        { status: 400 }
      );
    }

    // Get the current user to check if they exist (including inactive users)
    const currentUser = await getUserByIdForAdmin(id);
    if (!currentUser.success || !currentUser.data) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { is_active } = body;

    // Validate the is_active parameter
    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        { success: false, error: "is_active must be a boolean value" },
        { status: 400 }
      );
    }

    // Update the user's active status
    const result = await updateUser(id, { isActive: is_active });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const action = is_active ? "activated" : "deactivated";
    
    return NextResponse.json({
      success: true,
      message: `User ${action} successfully`,
      user: result.data,
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user status" },
      { status: 500 }
    );
  }
}