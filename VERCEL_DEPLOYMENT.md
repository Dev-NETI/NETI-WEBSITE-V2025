# Vercel Deployment Guide

## Problem Fixed ✅

The login authentication was failing in production because the original system used file-based JSON storage (`data/admins.json`, `data/sessions.json`) which doesn't work in Vercel's serverless environment.

### What was changed:

1. **Authentication System**: Replaced file-based admin storage with environment variable approach
2. **Session Management**: Moved from file-based sessions to JWT-only approach
3. **Events Storage**: Added fallback system that works in both development and production

## Required Environment Variables

To deploy successfully to Vercel, add these environment variables in your Vercel dashboard:

### Authentication Variables

```bash
# Admin login credentials
ADMIN_EMAIL=admin@neti.com.ph
ADMIN_PASSWORD=your-secure-password-here

# Admin name (optional)
ADMIN_NAME=NETI Administrator

# JWT Secret (REQUIRED for security)
JWT_SECRET=your-very-secure-jwt-secret-key-here
```

### Optional Events Data (if you want custom events)

```bash
# JSON string of events data (optional - will use defaults if not provided)
EVENTS_DATA=[{"id":"1","title":"Your Event","date":"2025-01-15",...}]
```

## How to Add Environment Variables in Vercel

1. Go to your project dashboard on [vercel.com](https://vercel.com)
2. Click on **Settings** tab
3. Click on **Environment Variables** in the sidebar
4. Add each variable:

   - **Name**: `ADMIN_EMAIL`
   - **Value**: `admin@neti.com.ph`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

5. Repeat for all variables above

## Security Recommendations

### 1. Change Default Credentials

**Important**: Change the default admin credentials before deploying to production:

```bash
ADMIN_EMAIL=your-admin@yourcompany.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### 2. Use Strong JWT Secret

Generate a strong JWT secret (32+ characters):

```bash
JWT_SECRET=your-super-secret-jwt-key-that-is-very-long-and-secure-123456789
```

### 3. Hash Your Password (Recommended)

For extra security, you can use a hashed password:

1. Generate a hash using bcrypt (strength 12):

   ```javascript
   const bcrypt = require("bcryptjs");
   const hash = await bcrypt.hash("your-password", 12);
   console.log(hash); // Use this as ADMIN_PASSWORD
   ```

2. Set the hashed value as `ADMIN_PASSWORD`

## How the New System Works

### Development (Local)

- Uses file system (`data/admins.json`, `data/events.json`) as before
- Falls back to environment variables if files don't exist

### Production (Vercel)

- **Authentication**: Uses environment variables only
- **Sessions**: JWT tokens stored in httpOnly cookies
- **Events**: Uses in-memory storage with fallback to default events
- **File writes**: Gracefully fail (expected behavior) but use memory storage

## Testing Before Deployment

1. Set environment variables locally:

   ```bash
   # In your .env.local file
   ADMIN_EMAIL=test@example.com
   ADMIN_PASSWORD=testpassword
   JWT_SECRET=test-jwt-secret-key
   ```

2. Test login functionality:

   ```bash
   npm run dev
   ```

3. Navigate to `/admin/login` and test with your credentials

## Deployment Steps

1. **Set Environment Variables** (as described above)

2. **Deploy to Vercel**:

   ```bash
   npm run build  # Test locally first
   # Then deploy via Vercel dashboard or CLI
   ```

3. **Test Production Login**:
   - Go to `https://your-app.vercel.app/admin/login`
   - Use the credentials you set in environment variables
   - Should work without the 401 error

## Current System Features

✅ **Works in Development**: File-based storage for easy local development  
✅ **Works in Production**: Environment variables and memory storage for Vercel  
✅ **Secure**: JWT tokens, httpOnly cookies, bcrypt password support  
✅ **Fallback**: Default events if no custom data provided  
✅ **Backwards Compatible**: Existing admin panel functionality unchanged

## Default Login Credentials

If you don't set environment variables, the system will use:

- **Email**: `admin@neti.com.ph`
- **Password**: `admin123`

**⚠️ Make sure to change these in production!**

## Need Help?

If you encounter issues:

1. Check Vercel function logs in your dashboard
2. Verify all environment variables are set correctly
3. Test locally with the same environment variables first
4. Make sure your JWT_SECRET is set and secure

The authentication system is now fully compatible with Vercel's serverless environment! 🚀
