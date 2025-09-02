// Configuration constants
export const config = {
  // Laravel Backend
  LARAVEL_BASE_URL:
    process.env.NEXT_PUBLIC_LARAVEL_BASE_URL || "http://localhost:8000",

  // API Configuration
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),

  // Authentication
  TOKEN_STORAGE_KEY: process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || "admin-token",
  AUTH_COOKIE_NAME: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "admin-token",
  SESSION_TIMEOUT: parseInt(
    process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "86400000"
  ), // 24 hours

  // Application
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "NETI Admin Dashboard",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0",

  // Development
  IS_DEVELOPMENT: process.env.NEXT_PUBLIC_ENV === "development",
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG === "true",

  // Security
  ENABLE_CSRF_PROTECTION:
    process.env.NEXT_PUBLIC_ENABLE_CSRF_PROTECTION === "true",

  // Features
  ENABLE_ROLE_BASED_ACCESS:
    process.env.NEXT_PUBLIC_ENABLE_ROLE_BASED_ACCESS === "true",
  ENABLE_MULTI_FACTOR_AUTH:
    process.env.NEXT_PUBLIC_ENABLE_MULTI_FACTOR_AUTH === "true",
  ENABLE_PASSWORD_RESET:
    process.env.NEXT_PUBLIC_ENABLE_PASSWORD_RESET === "true",
  ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === "true",

  // Logging
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
  ENABLE_API_LOGGING: process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === "true",

  // API Endpoints
  API_ENDPOINTS: {
    ADMIN_LOGIN: "/api/admin/login",
    ADMIN_LOGOUT: "/api/admin/logout",
    ADMIN_VERIFY: "/api/admin/verify",
    ADMIN_PROFILE: "/api/admin/profile",
  },
} as const;

// Type definitions for better TypeScript support
export type Config = typeof config;
export type ApiEndpoint = keyof typeof config.API_ENDPOINTS;
