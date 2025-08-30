import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type UserRole = 'super_admin' | 'events_manager' | 'news_manager' | 'user_manager';

export interface Admin {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Session {
  id: string;
  adminId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  admin?: Omit<Admin, "password">;
  error?: string;
}

// JWT secret - in production, this should be an environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || "neti-admin-secret-key-change-in-production";

// Admin credentials from environment variables (fallback)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@neti.com.ph";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "NETI Administrator";

// Get the default admin from environment variables (fallback)
function getDefaultAdmin(): Admin {
  return {
    id: "admin-1",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: ADMIN_NAME,
    role: "super_admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Get admin by email (database only on server side)
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    // Dynamic import to avoid loading database on client side
    if (typeof window === 'undefined') {
      const { getUserByEmail } = await import('./user-db');
      const result = await getUserByEmail(email);
      if (!result.success || !result.data) return null;
      
      return {
        id: result.data.id,
        email: result.data.email,
        password: result.data.password || '',
        name: result.data.name,
        role: result.data.role,
        createdAt: result.data.created_at,
        updatedAt: result.data.updated_at,
        lastLogin: result.data.last_login
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting admin by email:", error);
    return null;
  }
}

// Get admin by ID (database only on server side)
export async function getAdminById(id: string): Promise<Admin | null> {
  try {
    // Dynamic import to avoid loading database on client side
    if (typeof window === 'undefined') {
      const { getUserById } = await import('./user-db');
      const result = await getUserById(id);
      if (!result.success || !result.data) return null;
      
      return {
        id: result.data.id,
        email: result.data.email,
        password: result.data.password || '',
        name: result.data.name,
        role: result.data.role,
        createdAt: result.data.created_at,
        updatedAt: result.data.updated_at,
        lastLogin: result.data.last_login
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting admin by ID:", error);
    return null;
  }
}

// Create session (JWT only, no file storage)
export async function createSession(adminId: string): Promise<string> {
  try {
    const token = jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "24h" });
    return token;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

// Verify token and get admin (JWT only)
export async function verifyToken(token: string): Promise<Admin | null> {
  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };

    // Get admin by ID
    const admin = await getAdminById(decoded.adminId);
    return admin;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

// Delete session (logout) - with JWT only, we just need to clear the client-side cookie
export async function deleteSession(token: string): Promise<boolean> {
  try {
    // Verify the token exists and is valid
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
    return !!decoded;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
}

// Authenticate admin (database only on server side)
export async function authenticateAdmin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const { email, password } = credentials;

    // Try database authentication first (server side only)
    if (typeof window === 'undefined') {
      try {
        const { authenticateUser } = await import('./user-db');
        const result = await authenticateUser(email, password);
        if (result.success && result.data) {
          // Create session token
          const token = await createSession(result.data.id);
          
          return {
            success: true,
            message: "Login successful",
            token,
            admin: {
              id: result.data.id,
              email: result.data.email,
              name: result.data.name,
              role: result.data.role,
              createdAt: result.data.created_at,
              updatedAt: result.data.updated_at,
              lastLogin: new Date().toISOString(),
            },
          };
        }
      } catch (dbError) {
        console.log('Database authentication failed, falling back to default admin', dbError);
      }
    }

    // Fallback to environment variables for backward compatibility
    const admin = getDefaultAdmin();
    if (admin.email.toLowerCase() !== email.toLowerCase()) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify password for default admin
    let isValidPassword = false;
    if (
      admin.password.startsWith("$2a$") ||
      admin.password.startsWith("$2b$")
    ) {
      isValidPassword = await bcrypt.compare(password, admin.password);
    } else {
      isValidPassword = password === admin.password;
    }

    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session token
    const token = await createSession(admin.id);

    return {
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        lastLogin: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error authenticating admin:", error);
    return {
      success: false,
      error: "Authentication failed. Please try again.",
    };
  }
}

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}
