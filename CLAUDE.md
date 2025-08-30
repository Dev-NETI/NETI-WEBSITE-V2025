# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server (auto-assigns port if 3000 is busy)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing

No testing framework is currently configured.

### Database Setup

**Database Architecture:** This project uses a **hybrid database approach**:

1. **Document Database (JSON Files):** Local JSON files in the `data/` folder for development and fallback operations
   - `data/news.json` - News articles storage
   - `data/events.json` - Events storage  
   - `data/users.json` - User accounts storage
   - `data/admins.json` - Admin accounts storage
   - `data/sessions.json` - Session management

2. **Production Database:** Vercel Postgres with auto-initialization for production deployments

**Important:** This is a document database system using JSON files for data persistence. Future Claude instances should be aware that this project does NOT use traditional SQL databases for data operations, but instead relies on file-based JSON storage with specialized database operation functions.

## Project Architecture

This is a **Next.js 15** application using the **App Router** with **TypeScript** and **Tailwind CSS v4**. The project is a maritime training company website for NETI (NYK-Fil Maritime E-Training Inc) with a comprehensive admin management system.

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Vercel Postgres (@vercel/postgres) with serverless optimization
- **Authentication**: JWT with httpOnly cookies, bcrypt password hashing
- **Styling**: Tailwind CSS v4 with PostCSS
- **Animation**: Framer Motion for page transitions and interactions
- **Icons**: Lucide React
- **UI Components**: Custom React components with role-based access control

### Application Architecture

#### Frontend Structure

```
src/
├── app/                    # App Router pages and API routes
│   ├── admin/             # Admin panel with protected routes
│   │   ├── dashboard/     # Main admin dashboard
│   │   ├── users/         # User management (CRUD, roles)
│   │   ├── events/        # Event management
│   │   ├── news/          # News management system
│   │   └── login/         # Admin authentication
│   ├── api/               # REST API endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management API
│   │   ├── events/        # Event management API
│   │   └── news/          # News management API
│   └── (public pages)/    # Public website pages
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication state management
│   └── usePermissions.ts  # Role-based permissions
└── lib/                   # Core business logic
    ├── auth.ts            # JWT authentication utilities
    ├── user.ts            # User CRUD operations
    ├── user-db.ts         # User database operations (JSON)
    ├── news-db.ts         # News database operations (JSON)
    ├── events-db.ts       # Events database operations (JSON)
    ├── document-db.ts     # Document database utilities
    ├── database.ts        # Event data operations (legacy)
    ├── mysql.ts           # Database connection management
    └── middleware.ts      # API route protection
```

#### Authentication & Authorization System

- **JWT-based authentication** with httpOnly cookies (`admin-token`)
- **Role-based access control** with 4 user roles:
  - `super_admin`: Full system access (users, events, news, settings)
  - `user_manager`: User management only
  - `events_manager`: Event management only  
  - `news_manager`: News management only (NEW - manages maritime news articles)
- **Protected routes** using `ProtectedRoute` component wrapper
- **API middleware** for role-based endpoint protection
- **Dynamic server-side imports** to avoid mysql2 client-side loading issues

#### Database Architecture

- **Vercel Postgres** with serverless-optimized connection handling
- **Global connection caching** for serverless functions
- **Auto-initialization** of all database tables on first API call
- **Default admin account**: `admin@neti.com.ph` with all permissions
- **Soft delete pattern** for user deactivation
- **Password hashing** using bcrypt with salt rounds
- **Transaction support** for complex operations

#### Key Architectural Patterns

1. **Serverless Database Pattern**: Uses Vercel Postgres with global connection caching to prevent connection exhaustion in serverless functions.

2. **Database Result Pattern**: All database operations return `DatabaseResult<T>` objects with success/error handling.

3. **Dynamic Import Pattern**: Database modules use conditional imports (`typeof window === 'undefined'`) to avoid browser execution.

4. **Cookie-based Authentication**: Uses httpOnly cookies for security with consistent naming (`admin-token`).

5. **Role-Permission Mapping**: Centralized permission system that maps user roles to specific capabilities.

6. **Protected Component Pattern**: Admin pages wrapped in `ProtectedRoute` with automatic redirect to login.

### Environment Configuration

**Development** (`.env.local`):

```env
# Vercel Postgres (get from Vercel dashboard)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database

# Authentication
JWT_SECRET=your-secure-secret-key-min-32-chars
ADMIN_EMAIL=admin@neti.com.ph
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

**Production** (Vercel Environment Variables):
Set the same variables in Vercel Dashboard → Settings → Environment Variables

### API Endpoints

#### Authentication

- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/verify` - Token validation and user info retrieval
- `GET /api/auth/profile` - Current user profile with permissions
- `POST /api/auth/logout` - Session termination

#### User Management

- `GET /api/users` - List all users (admin/user_manager only)
- `POST /api/users` - Create new user with role assignment
- `GET /api/users/[id]` - Get specific user details
- `PUT /api/users/[id]` - Update user (profile, role, status)
- `DELETE /api/users/[id]` - Soft delete user account

#### News Management (NEW)

- `GET /api/news` - List all published news articles (public endpoint)
- `POST /api/news` - Create new news article (news_manager/super_admin only)
- `GET /api/news/[id]` - Get specific news article by ID (public endpoint)
- `PUT /api/news/[id]` - Update news article (news_manager/super_admin only)
- `DELETE /api/news/[id]` - Delete news article (news_manager/super_admin only)

#### Events Management

- `GET /api/events` - List all events (public endpoint)
- `POST /api/events` - Create new event (events_manager/super_admin only)
- `GET /api/events/[id]` - Get specific event by ID (public endpoint)
- `PUT /api/events/[id]` - Update event (events_manager/super_admin only)
- `DELETE /api/events/[id]` - Delete event (events_manager/super_admin only)

#### News Management System (NEW)

This application now includes a comprehensive news management system with the following features:

**Frontend Features:**
- **Horizontal News Slider**: Beautiful animated slider on the landing page using Framer Motion
- **Admin News Management**: Full CRUD interface for news articles in `/admin/news`
- **News Creation Form**: Rich form with validation in `/admin/news/create`
- **Dynamic Content**: Real-time loading from JSON database
- **Responsive Design**: Mobile-first design with Tailwind CSS

**News Article Schema:**
```typescript
interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  author_title: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  views: number;
  created_at: string;
  updated_at: string;
}
```

**Key Components:**
- `NewsSlider` - Animated horizontal slider with drag support, auto-play, and beautiful transitions
- `AdminNewsPage` - News management interface with filtering, search, and bulk operations
- `CreateNewsPage` - News creation form with validation and auto-slug generation

**Database Operations:**
- All news operations are handled through `src/lib/news-db.ts`
- Data is stored in `data/news.json` as a document database
- Includes functions for CRUD operations, filtering, and view tracking

### Development Guidelines

#### Component Patterns

- Client components marked with "use client" directive
- TypeScript interfaces for all component props
- Consistent Framer Motion animations with spring physics
- Protected admin components use permission hooks

#### Authentication Flow

1. Login form submits to `/api/auth/login`
2. Server validates credentials and sets `admin-token` cookie
3. Client redirects to `/admin/dashboard`
4. Protected routes verify token via `/api/auth/verify`
5. Permissions checked client-side via `usePermissions` hook

#### Database Operations

- All database code isolated to API routes (`/lib/*-db.ts` files)
- Uses `DatabaseResult<T>` pattern for consistent error handling
- Global connection caching for serverless optimization
- Auto-initialization of required database tables
- Transaction support for complex operations

#### Deployment Considerations

- **Vercel-native**: Uses `@vercel/postgres` for optimal serverless performance
- **Connection pooling**: Global connection caching prevents connection exhaustion
- **Auto-initialization**: Database schema created automatically on deployment
- **Environment variables**: All sensitive config externalized
- **Build optimization**: Static generation where possible
- **API route protection**: Consistent authentication middleware
- **Transaction support**: Complex operations use database transactions

### Security Implementation

- Password hashing with bcrypt (12 salt rounds)
- JWT token expiration (24 hours)
- HttpOnly cookie security flags
- Input validation on all API endpoints
- Role-based endpoint access control
- CSRF protection via SameSite cookies

### Error Handling Patterns

- API endpoints return consistent JSON response format
- Client-side error boundaries for graceful failure
- Database connection retry logic
- Authentication token refresh handling
- Form validation with user-friendly messages
