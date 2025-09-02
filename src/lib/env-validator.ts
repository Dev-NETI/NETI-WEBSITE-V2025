import { config } from './config';

// Environment validation utility
export interface EnvironmentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: typeof config;
}

// Required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_LARAVEL_BASE_URL',
] as const;

// Validate environment configuration
export function validateEnvironment(): EnvironmentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Validate Laravel backend URL format
  try {
    new URL(config.LARAVEL_BASE_URL);
  } catch {
    errors.push('Invalid LARAVEL_BASE_URL format. Must be a valid URL.');
  }

  // Check if running in development with debug mode
  if (config.IS_DEVELOPMENT && !config.DEBUG_MODE) {
    warnings.push('Running in development mode but DEBUG_MODE is disabled');
  }

  // Check API timeout value
  if (config.API_TIMEOUT < 1000) {
    warnings.push('API_TIMEOUT is set to less than 1 second, this may cause issues');
  }

  // Check session timeout value
  if (config.SESSION_TIMEOUT < 60000) { // Less than 1 minute
    warnings.push('SESSION_TIMEOUT is set to less than 1 minute, this may cause frequent logouts');
  }

  // Check if backend URL uses HTTP in production
  if (!config.IS_DEVELOPMENT && config.LARAVEL_BASE_URL.startsWith('http://')) {
    warnings.push('Using HTTP instead of HTTPS in production environment');
  }

  // Check token storage configuration
  if (!config.TOKEN_STORAGE_KEY) {
    errors.push('TOKEN_STORAGE_KEY is not configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config,
  };
}

// Print environment validation results
export function printEnvironmentStatus(): void {
  const validation = validateEnvironment();
  
  console.group('🔧 Environment Configuration');
  
  // Print configuration
  console.log('📋 Configuration:', {
    environment: config.IS_DEVELOPMENT ? 'development' : 'production',
    backendUrl: config.LARAVEL_BASE_URL,
    debugMode: config.DEBUG_MODE,
    apiTimeout: `${config.API_TIMEOUT}ms`,
    sessionTimeout: `${config.SESSION_TIMEOUT}ms`,
  });

  // Print errors
  if (validation.errors.length > 0) {
    console.group('❌ Errors');
    validation.errors.forEach(error => console.error(error));
    console.groupEnd();
  }

  // Print warnings
  if (validation.warnings.length > 0) {
    console.group('⚠️ Warnings');
    validation.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  // Print status
  if (validation.isValid) {
    console.log('✅ Environment configuration is valid');
  } else {
    console.error('❌ Environment configuration has errors');
  }

  console.groupEnd();
}

// Check backend connectivity
export async function checkBackendConnectivity(): Promise<boolean> {
  try {
    const response = await fetch(`${config.LARAVEL_BASE_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Initialize environment (call this in your main app component)
export async function initializeEnvironment(): Promise<void> {
  if (config.DEBUG_MODE) {
    printEnvironmentStatus();
    
    // Check backend connectivity
    const isBackendOnline = await checkBackendConnectivity();
    console.log(
      isBackendOnline 
        ? '✅ Laravel backend is reachable' 
        : '❌ Laravel backend is not reachable'
    );
  }
}