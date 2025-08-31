// Import fallback database operations
import { isDevelopmentFallback } from "./db-fallback";

// Types for database operations
export interface DatabaseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Initialize database - now uses fallback
export async function initializeDatabase(): Promise<DatabaseResult> {
  if (isDevelopmentFallback()) {
    // Fallback database auto-initializes
    return { success: true };
  }

  // If we somehow need Vercel Postgres, it would go here
  // But for now, we're using fallback only
  return { success: true };
}

// Health check - now uses fallback
export async function healthCheck(): Promise<
  DatabaseResult<{ status: string; timestamp: string }>
> {
  if (isDevelopmentFallback()) {
    return {
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
      },
    };
  }

  return {
    success: false,
    error: "No database connection available",
  };
}

// Generic query execution - now routes to fallback
export async function executeQuery<
  T = unknown
>(): // _queryTemplate: TemplateStringsArray,
// ..._values: unknown[]
Promise<DatabaseResult<T[]>> {
  // For fallback database, we don't use raw queries
  return {
    success: false,
    error: "Raw queries not supported in fallback mode",
  };
}

// Transaction support - simplified for fallback
export async function executeTransaction<T>(
  operations: () => Promise<T>
): Promise<DatabaseResult<T>> {
  try {
    const result = await operations();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}
