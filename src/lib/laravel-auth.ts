// Laravel backend authentication utilities
import { config } from "./config";

const LARAVEL_BASE_URL = config.LARAVEL_BASE_URL;

export interface LaravelAuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
    last_login?: string;
  };
}

// Get stored token
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(config.TOKEN_STORAGE_KEY);
  }
  return null;
}

// Set auth token
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(config.TOKEN_STORAGE_KEY, token);
  }
}

// Remove auth token
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(config.TOKEN_STORAGE_KEY);
  }
}

// Create auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Login function
export async function loginToLaravel(
  email: string,
  password: string
): Promise<LaravelAuthResponse> {
  try {
    console.log("Attempting Laravel login", { email });

    const response = await fetch(`${LARAVEL_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success && result.token) {
      setAuthToken(result.token);
      console.log("Laravel login successful", {
        email,
        role: result.admin?.role,
      });
      return result;
    } else {
      console.warn("Laravel login failed", { email, error: result.error });
      return {
        success: false,
        error: result.error || "Login failed",
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Network error. Please try again.";
    console.error("Laravel login error", { email, error: errorMessage });
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Verify token function
export async function verifyLaravelToken(): Promise<LaravelAuthResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn("No authentication token found");
      return {
        success: false,
        error: "No authentication token",
      };
    }

    console.log("Verifying Laravel token");

    const response = await fetch(`${LARAVEL_BASE_URL}/api/admin/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!result.success) {
      removeAuthToken();
      console.warn("Token verification failed", { error: result.error });
    } else {
      console.log("Token verification successful", { role: result.admin?.role });
    }

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Token verification failed";
    console.error("Laravel verify error", { error: errorMessage });
    removeAuthToken();
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Logout function
export async function logoutFromLaravel(): Promise<LaravelAuthResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("Already logged out");
      return {
        success: true,
        message: "Already logged out",
      };
    }

    console.log("Logging out from Laravel");

    const response = await fetch(`${LARAVEL_BASE_URL}/api/admin/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Always remove token on logout attempt
    removeAuthToken();
    console.log("Logout successful");

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Logout error";
    console.error("Laravel logout error", { error: errorMessage });
    removeAuthToken();
    return {
      success: true,
      message: "Logged out (offline)",
    };
  }
}

// Get profile function
export async function getProfileFromLaravel(): Promise<LaravelAuthResponse> {
  try {
    Logger.info("Getting profile from Laravel");

    const result: LaravelAuthResponse = await apiRequest(
      `${LARAVEL_BASE_URL}${config.API_ENDPOINTS.ADMIN_PROFILE}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!result.success) {
      removeAuthToken();
      Logger.warn("Failed to get profile", { error: result.error });
    } else {
      Logger.info("Profile retrieved successfully", { role: result.admin?.role });
    }

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to get profile";
    Logger.error("Laravel profile error", { error: errorMessage });
    return {
      success: false,
      error: errorMessage,
    };
  }
}
