import { config } from "./config";

// API Error handling
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Logger utility
export class Logger {
  static log(
    level: "info" | "warn" | "error",
    message: string,
    data?: any
  ): void {
    if (!config.ENABLE_API_LOGGING && !config.DEBUG_MODE) return;

    const timestamp = new Date().toISOString();
    const logData = data
      ? { message, data, timestamp }
      : { message, timestamp };

    switch (level) {
      case "info":
        console.info(`[${timestamp}] INFO:`, logData);
        break;
      case "warn":
        console.warn(`[${timestamp}] WARN:`, logData);
        break;
      case "error":
        console.error(`[${timestamp}] ERROR:`, logData);
        break;
    }
  }

  static info(message: string, data?: any): void {
    this.log("info", message, data);
  }

  static warn(message: string, data?: any): void {
    this.log("warn", message, data);
  }

  static error(message: string, data?: any): void {
    this.log("error", message, data);
  }
}

// API Request wrapper with timeout and error handling
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT);

  try {
    Logger.info("API Request", { url, method: options.method || "GET" });

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message:
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: errorData.code,
        details: errorData,
      };

      Logger.error("API Request Failed", error);
      throw error;
    }

    const data = await response.json();
    Logger.info("API Request Success", { url, status: response.status });
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      const timeoutError: ApiError = {
        message: "Request timeout",
        code: "TIMEOUT",
      };
      Logger.error("API Request Timeout", timeoutError);
      throw timeoutError;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      const networkError: ApiError = {
        message: "Network error - unable to reach server",
        code: "NETWORK_ERROR",
      };
      Logger.error("Network Error", networkError);
      throw networkError;
    }

    Logger.error("API Request Error", error);
    throw error;
  }
}

// Retry logic for failed requests
export async function apiRequestWithRetry<T = any>(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest<T>(url, options);
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        Logger.error(`API Request failed after ${maxRetries} attempts`, error);
        throw error;
      }

      Logger.warn(
        `API Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  throw lastError;
}

// Health check utility
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${config.LARAVEL_BASE_URL}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
