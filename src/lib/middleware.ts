import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

type UserRole =
  | "super_admin"
  | "events_manager"
  | "news_manager"
  | "user_manager";
type Permission = "users" | "events" | "news" | "settings";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole | "admin";
  };
}

// Permission mapping for different roles
export const PERMISSIONS: Record<UserRole | "admin", Permission[]> = {
  super_admin: ["users", "events", "news", "settings"],
  user_manager: ["users"],
  events_manager: ["events"],
  news_manager: ["news"],
  admin: ["users", "events", "news", "settings"], // Legacy admin role with all permissions
};

// Check if user has specific permission
export function hasPermission(
  userRole: UserRole | "admin",
  permission: string
): boolean {
  const userPermissions = PERMISSIONS[userRole];
  return userPermissions?.includes(permission as Permission) || false;
}

// Middleware to check authentication
export async function requireAuth(request: NextRequest): Promise<{
  success: boolean;
  user?: { id: string; email: string; name: string; role: UserRole | "admin" };
  error?: string;
}> {
  try {
    // Get token from cookie
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    // Verify token
    const user = await verifyToken(token);

    if (!user) {
      return { success: false, error: "Invalid or expired token" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

// Middleware to check specific permission
export async function requirePermission(
  request: NextRequest,
  permission: string
): Promise<{
  success: boolean;
  user?: { id: string; email: string; name: string; role: UserRole | "admin" };
  error?: string;
}> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  const user = authResult.user!;

  if (!hasPermission(user.role, permission)) {
    return {
      success: false,
      error: `Insufficient permissions. Required: ${permission}`,
    };
  }

  return { success: true, user };
}

// Middleware to check multiple permissions (user needs at least one)
export async function requireAnyPermission(
  request: NextRequest,
  permissions: string[]
): Promise<{
  success: boolean;
  user?: { id: string; email: string; name: string; role: UserRole | "admin" };
  error?: string;
}> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  const user = authResult.user!;

  const hasAnyPermission = permissions.some((permission) =>
    hasPermission(user.role, permission)
  );

  if (!hasAnyPermission) {
    return {
      success: false,
      error: `Insufficient permissions. Required one of: ${permissions.join(
        ", "
      )}`,
    };
  }

  return { success: true, user };
}

// Helper function to create protected API route
export function withAuth(
  handler: (
    request: NextRequest,
    user: { id: string; email: string; name: string; role: UserRole | "admin" },
    ...args: unknown[]
  ) => Promise<NextResponse>,
  options: {
    permission?: string;
    permissions?: string[];
  } = {}
) {
  return async (request: NextRequest, ...args: unknown[]) => {
    let authResult;

    if (options.permission) {
      authResult = await requirePermission(request, options.permission);
    } else if (options.permissions) {
      authResult = await requireAnyPermission(request, options.permissions);
    } else {
      authResult = await requireAuth(request);
    }

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || "Authentication failed" },
        { status: authResult.error?.includes("Authentication") ? 401 : 403 }
      );
    }

    return handler(request, authResult.user, ...args);
  };
}

// Middleware for role-based access
export function requireRole(roles: (UserRole | 'admin') | (UserRole | 'admin')[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return async (
    request: NextRequest
  ): Promise<{
    success: boolean;
    user?: {
      id: string;
      email: string;
      name: string;
      role: UserRole | "admin";
    };
    error?: string;
  }> => {
    const authResult = await requireAuth(request);

    if (!authResult.success) {
      return authResult;
    }

    const user = authResult.user!;

    if (!allowedRoles.includes(user.role)) {
      return {
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      };
    }

    return { success: true, user };
  };
}

// Helper to create role-protected API route
export function withRole(
  handler: (
    request: NextRequest,
    user: { id: string; email: string; name: string; role: UserRole | "admin" },
    ...args: unknown[]
  ) => Promise<NextResponse>,
  roles: (UserRole | 'admin') | (UserRole | 'admin')[]
) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const authResult = await requireRole(roles)(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication failed' },
        { status: authResult.error?.includes("Authentication") ? 401 : 403 }
      );
    }

    return handler(request, authResult.user, ...args);
  };
}
