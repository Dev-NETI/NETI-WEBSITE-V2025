// Laravel backend authentication utilities
import { config } from "./config";
import { apiRequest, Logger } from "./api-utils";

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
    Logger.info("Attempting Laravel login", { email });

    const result: LaravelAuthResponse = await apiRequest(
      `${LARAVEL_BASE_URL}${config.API_ENDPOINTS.ADMIN_LOGIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (result.success && result.token) {
      setAuthToken(result.token);
      Logger.info("Laravel login successful", {
        email,
        role: result.admin?.role,
      });
    } else {
      Logger.warn("Laravel login failed", { email, error: result.error });
    }

    return result;
  } catch (error: any) {
    Logger.error("Laravel login error", { email, error: error.message });
    return {
      success: false,
      error: error.message || "Network error. Please try again.",
    };
  }
}

// Verify token function
export async function verifyLaravelToken(): Promise<LaravelAuthResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      Logger.warn("No authentication token found");
      return {
        success: false,
        error: "No authentication token",
      };
    }

    Logger.info("Verifying Laravel token");

    const result: LaravelAuthResponse = await apiRequest(
      `${LARAVEL_BASE_URL}${config.API_ENDPOINTS.ADMIN_VERIFY}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!result.success) {
      removeAuthToken();
      Logger.warn("Token verification failed", { error: result.error });
    } else {
      Logger.info("Token verification successful", { role: result.admin?.role });
    }

    return result;
  } catch (error: any) {
    Logger.error("Laravel verify error", { error: error.message });
    removeAuthToken();
    return {
      success: false,
      error: error.message || "Token verification failed",
    };
  }
}

// Logout function
export async function logoutFromLaravel(): Promise<LaravelAuthResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      Logger.info("Already logged out");
      return {
        success: true,
        message: "Already logged out",
      };
    }

    Logger.info("Logging out from Laravel");

    const result: LaravelAuthResponse = await apiRequest(
      `${LARAVEL_BASE_URL}${config.API_ENDPOINTS.ADMIN_LOGOUT}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    // Always remove token on logout attempt
    removeAuthToken();
    Logger.info("Logout successful");

    return result;
  } catch (error: any) {
    Logger.error("Laravel logout error", { error: error.message });
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
  } catch (error: any) {
    Logger.error("Laravel profile error", { error: error.message });
    return {
      success: false,
      error: error.message || "Failed to get profile",
    };
  }
}
