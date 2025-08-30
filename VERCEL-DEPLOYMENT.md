# 🚀 Vercel Deployment Guide for NETI Website

This guide provides step-by-step instructions for deploying the NETI website to Vercel with full database functionality.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com) (free tier works)
- [GitHub Account](https://github.com) for code repository
- Basic familiarity with Vercel dashboard

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended)

1. **Create Vercel Postgres Database:**

   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Create a new Postgres database
   vercel postgres create neti-database
   ```

2. **Get Database Connection Details:**
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Storage → Your database
   - Copy the connection details from the `.env.local` tab

### Option 2: External PostgreSQL (PlanetScale, Supabase, etc.)

You can use any PostgreSQL-compatible database. Just ensure you have the connection URL.

## 🔧 Environment Variables Setup

1. **In your Vercel project dashboard**, go to Settings → Environment Variables

2. **Add the following variables:**

### Required Database Variables

```env
# Vercel Postgres (if using Option 1)
POSTGRES_URL=your_postgres_url_here
POSTGRES_PRISMA_URL=your_postgres_prisma_url_here
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling_here
POSTGRES_USER=your_postgres_user_here
POSTGRES_HOST=your_postgres_host_here
POSTGRES_PASSWORD=your_postgres_password_here
POSTGRES_DATABASE=your_postgres_database_here
```

### Application Configuration

```env
# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars

# Default Admin Account
ADMIN_EMAIL=admin@neti.com.ph
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NAME=NETI Super Administrator

# Environment
NODE_ENV=production
```

## 🚢 Deployment Steps

### 1. Prepare Your Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Vercel CLI**

```bash
# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project? (N)
# - What's your project's name? (neti-website)
# - In which directory is your code located? (./)
```

**Option B: Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project settings:
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

### 3. Database Initialization

The database tables will be automatically created on the first API call. To manually initialize:

1. Open your deployed site
2. Navigate to `/admin/login`
3. The database will initialize automatically when you first try to login

Or make a direct API call:

```bash
curl https://your-app.vercel.app/api/auth/verify
```

## 🔐 Security Configuration

### 1. JWT Secret Generation

Generate a secure JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

### 2. Admin Password

**Important:** Change the default admin password after first login!

1. Login with default credentials
2. Go to User Management
3. Edit your admin profile
4. Set a strong password

### 3. Environment-Specific Settings

Ensure these are set correctly in Vercel:

- `NODE_ENV=production`
- Use HTTPS-only cookies (automatic in production)
- Set secure JWT secret (minimum 32 characters)

## 📊 Monitoring & Maintenance

### Database Monitoring

- Monitor database usage in Vercel dashboard
- Set up alerts for connection limits
- Regular database backups (if needed)

### Application Monitoring

- Check Vercel Analytics for performance
- Monitor serverless function execution times
- Watch for API rate limits

### Logs Access

```bash
# View real-time logs
vercel logs your-app-url --follow

# View specific deployment logs
vercel logs your-app-url --since 1h
```

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Errors**

```
Error: Connection failed
```

**Solution:**

- Verify all `POSTGRES_*` environment variables are set
- Check database is accessible from Vercel's IP ranges
- Ensure connection string format is correct

**2. JWT Token Issues**

```
Error: Invalid token
```

**Solution:**

- Verify `JWT_SECRET` is set and consistent
- Check token expiration (24h default)
- Clear browser cookies and login again

**3. Build Failures**

```
Error: Module not found
```

**Solution:**

- Ensure all dependencies are in `package.json`
- Check import paths are correct
- Verify environment variables are set

### Development vs Production

**Local Development:**

```bash
# Use .env.local file
npm run dev
```

**Production Checks:**

```bash
# Test production build locally
npm run build
npm start
```

## 🚀 Post-Deployment

### 1. Verify Functionality

- [ ] Admin login works
- [ ] User management accessible
- [ ] Events display correctly
- [ ] Database operations function
- [ ] All API endpoints respond

### 2. Configure Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 3. Performance Optimization

- Enable Vercel Analytics
- Configure caching headers
- Optimize images with Next.js Image component
- Monitor serverless function performance

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check database connection
5. Review API responses

---

**🎉 Your NETI website is now live on Vercel with full database functionality!**

Access your admin panel at: `https://your-app.vercel.app/admin/login`
