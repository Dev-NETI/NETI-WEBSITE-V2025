# Vercel Postgres Setup for Local Development

## Step 1: Login to Vercel (Required First)
```bash
vercel login
# Choose your preferred login method (GitHub, Google, etc.)
# Complete the authentication process in your browser
```

## Step 2: Create Postgres Database
```bash
# Navigate to your project directory
cd "C:\xampp\htdocs\NETI-WEBSITE-V2025"

# Create a new Postgres database
vercel postgres create neti-database

# This will create a database and show you the connection details
```

## Step 3: Get Database Environment Variables
```bash
# Link your local project to Vercel (if not already linked)
vercel link

# Pull the environment variables from Vercel
vercel env pull .env.local
```

## Alternative: Manual Environment Setup
If you prefer to set up manually, after creating the database:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Your database (`neti-database`)
3. Go to the `.env.local` tab
4. Copy all the `POSTGRES_*` environment variables

Then add them to your `.env.local` file:

```env
# Vercel Postgres Configuration
POSTGRES_URL="your_postgres_url_here"
POSTGRES_PRISMA_URL="your_postgres_prisma_url_here"  
POSTGRES_URL_NON_POOLING="your_postgres_url_non_pooling_here"
POSTGRES_USER="your_postgres_user_here"
POSTGRES_HOST="your_postgres_host_here"
POSTGRES_PASSWORD="your_postgres_password_here"
POSTGRES_DATABASE="your_postgres_database_here"

# Keep your existing configuration
JWT_SECRET=neti-admin-secret-key-change-in-production-2024
ADMIN_EMAIL=admin@neti.com.ph
ADMIN_PASSWORD=admin123
ADMIN_NAME=NETI Super Administrator
NODE_ENV=development
```

## Step 4: Test Database Connection
After setting up the environment variables:

```bash
# Start development server
npm run dev

# Test the database connection by attempting login
# Visit: http://localhost:3000/admin/login
# Use: admin@neti.com.ph / admin123
```

## Step 5: Initialize Database Tables
The database tables will be automatically created when you first try to login or you can initialize them manually:

```bash
# Make a direct API call to initialize
curl http://localhost:3000/api/auth/verify
```

## Verification Steps
1. ✅ Vercel CLI installed and logged in
2. ✅ Postgres database created (`neti-database`)
3. ✅ Environment variables configured in `.env.local`
4. ✅ Development server starts without errors
5. ✅ Login works at `/admin/login`
6. ✅ Database tables are created and populated

## Troubleshooting

### Connection Errors
- Verify all `POSTGRES_*` environment variables are correctly set
- Check that the database URL is accessible
- Ensure your Vercel account has access to the database

### Login Issues
- Clear browser cookies and try again
- Check console for any error messages
- Verify JWT_SECRET is set in environment variables

### Database Initialization
- The system will automatically create tables on first use
- Check the console logs for any database initialization messages
- Ensure the database user has CREATE TABLE permissions

---

**Next Steps**: After completing these steps, your local development will use the real Vercel Postgres database instead of the fallback system!