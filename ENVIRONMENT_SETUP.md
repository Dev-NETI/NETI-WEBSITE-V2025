# Environment Configuration Guide

This document outlines the environment configuration for the NETI Website project with Laravel backend integration.

## Frontend Environment Variables

### Required Environment Variables

Create a `.env.local` file in the Next.js root directory with the following variables:

#### Laravel Backend Configuration
```bash
NEXT_PUBLIC_LARAVEL_BASE_URL=http://localhost:8000
```
- **Description**: Base URL for the Laravel backend API
- **Required**: Yes
- **Default**: `http://localhost:8000`
- **Production**: Update to your production Laravel URL

#### API Configuration
```bash
NEXT_PUBLIC_API_TIMEOUT=10000
```
- **Description**: API request timeout in milliseconds
- **Required**: No
- **Default**: `10000` (10 seconds)

#### Authentication Configuration
```bash
NEXT_PUBLIC_TOKEN_STORAGE_KEY=admin-token
NEXT_PUBLIC_AUTH_COOKIE_NAME=admin-token
NEXT_PUBLIC_SESSION_TIMEOUT=86400000
```
- **TOKEN_STORAGE_KEY**: LocalStorage key for storing auth tokens
- **AUTH_COOKIE_NAME**: Cookie name for authentication (matches Laravel)
- **SESSION_TIMEOUT**: Session timeout in milliseconds (24 hours)

#### Application Configuration
```bash
NEXT_PUBLIC_APP_NAME="NETI Admin Dashboard"
NEXT_PUBLIC_APP_VERSION=2.0.0
```
- **APP_NAME**: Application display name
- **APP_VERSION**: Current application version

#### Development Configuration
```bash
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_DEBUG=true
```
- **ENV**: Environment type (`development`, `production`, `staging`)
- **DEBUG**: Enable debug logging and development features

#### Security Configuration
```bash
NEXT_PUBLIC_ENABLE_CSRF_PROTECTION=true
```
- **ENABLE_CSRF_PROTECTION**: Enable CSRF protection features

#### Feature Flags
```bash
NEXT_PUBLIC_ENABLE_ROLE_BASED_ACCESS=true
NEXT_PUBLIC_ENABLE_MULTI_FACTOR_AUTH=false
NEXT_PUBLIC_ENABLE_PASSWORD_RESET=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=false
```
- **ENABLE_ROLE_BASED_ACCESS**: Enable role-based access control
- **ENABLE_MULTI_FACTOR_AUTH**: Enable MFA (future feature)
- **ENABLE_PASSWORD_RESET**: Enable password reset functionality
- **ENABLE_OFFLINE_MODE**: Enable offline mode fallback

#### Logging Configuration
```bash
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_ENABLE_API_LOGGING=true
```
- **LOG_LEVEL**: Logging level (`info`, `warn`, `error`)
- **ENABLE_API_LOGGING**: Enable API request/response logging

## Environment Files

### `.env.local` (Development)
- Used for local development
- Contains development-specific values
- Not committed to version control

### `.env.example` (Template)
- Template file with all required variables
- Safe default values
- Committed to version control for reference

## Backend Environment Configuration

### Laravel `.env` Variables

Ensure your Laravel backend has the following variables configured:

```bash
# Application
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend CORS
FRONTEND_URL=http://localhost:3001

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=neti-website-2025
DB_USERNAME=root
DB_PASSWORD=

# Authentication
JWT_SECRET=your-secure-jwt-secret-key
```

## Configuration Access

### Frontend
```typescript
import { config } from '@/lib/config';

// Access configuration
const apiUrl = config.LARAVEL_BASE_URL;
const timeout = config.API_TIMEOUT;
const isDebug = config.DEBUG_MODE;
```

### TypeScript Support
The configuration includes full TypeScript support with type definitions:

```typescript
import { Config, ApiEndpoint } from '@/lib/config';
```

## Environment-Specific Setup

### Development
1. Copy `.env.example` to `.env.local`
2. Update `NEXT_PUBLIC_LARAVEL_BASE_URL` if Laravel runs on different port
3. Set `NEXT_PUBLIC_DEBUG=true` for detailed logging

### Production
1. Set `NEXT_PUBLIC_ENV=production`
2. Update `NEXT_PUBLIC_LARAVEL_BASE_URL` to production backend URL
3. Set `NEXT_PUBLIC_DEBUG=false`
4. Configure appropriate timeout values
5. Disable development features

### Staging
1. Set `NEXT_PUBLIC_ENV=staging`
2. Update backend URL to staging environment
3. Use production-like settings with enhanced logging

## Security Considerations

1. **Never commit `.env.local`** - Contains sensitive configuration
2. **Use HTTPS in production** - Update URLs to use `https://`
3. **Secure token storage** - Tokens are stored in localStorage (consider httpOnly cookies for enhanced security)
4. **CORS Configuration** - Ensure Laravel CORS is properly configured
5. **API Timeout** - Set appropriate timeouts to prevent hanging requests

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check Laravel CORS configuration
   - Verify `FRONTEND_URL` in Laravel `.env`

2. **Authentication Failures**
   - Verify Laravel backend is running
   - Check token storage key configuration
   - Ensure API endpoints are correct

3. **Network Timeouts**
   - Adjust `NEXT_PUBLIC_API_TIMEOUT`
   - Check network connectivity
   - Verify backend server status

### Debug Mode
Enable debug mode for detailed logging:
```bash
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_ENABLE_API_LOGGING=true
```

This will log all API requests, responses, and authentication attempts to the browser console.

## Version History

- **v2.0.0**: Laravel backend integration with environment configuration
- **v1.0.0**: Initial Next.js setup with document database