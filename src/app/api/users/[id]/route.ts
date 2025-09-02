import { NextRequest, NextResponse } from "next/server";
import { getUserByIdForAdmin, updateUser, deleteUser } from "@/lib/user-db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET /api/users/[id] - Get user by ID
export async function GET(
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

    const { id } = await params;

    // Check permissions
    if (
      admin.role !== "super_admin" &&
      admin.role !== "user_manager" &&
      admin.id !== id
    ) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }
    // Use getUserByIdForAdmin to include inactive users for admin view
    const result = await getUserByIdForAdmin(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    // Remove password from response
    const {
      // password: _password,
      ...userResponse
    } = result.data!;

    return NextResponse.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
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

    const { id } = await params;

    // Check permissions - users can update their own profile, managers can update others
    const canUpdate =
      admin.role === "super_admin" ||
      admin.role === "user_manager" ||
      admin.id === id;

    if (!canUpdate) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, password, role, isActive } = body;

    // Only super_admin and user_manager can change roles and active status
    if (
      (role !== undefined || isActive !== undefined) &&
      admin.role !== "super_admin" &&
      admin.role !== "user_manager"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions to change role or status",
        },
        { status: 403 }
      );
    }

    // Only super_admin can set super_admin role
    if (role === "super_admin" && admin.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Only super administrators can assign super admin role",
        },
        { status: 403 }
      );
    }

    // Validate role if provided
    if (role !== undefined) {
      const validRoles = [
        "super_admin",
        "events_manager",
        "news_manager",
        "user_manager",
      ];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, error: "Invalid role" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (email !== undefined) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (password !== undefined) updateData.password = password;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await updateUser(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === "User not found" ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: result.data,
    });
  } catch (error: unknown) {
    console.error("Error updating user:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (soft delete)
export async function DELETE(
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

    // Check permissions - only super_admin and user_manager can delete users
    if (admin.role !== "super_admin" && admin.role !== "user_manager") {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent self-deletion
    if (admin.id === id) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const result = await deleteUser(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
