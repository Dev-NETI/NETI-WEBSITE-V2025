import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface Admin {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: "admin";
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

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@neti.com.ph";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // This should be hashed
const ADMIN_NAME = process.env.ADMIN_NAME || "NETI Administrator";

// Get the default admin from environment variables
function getDefaultAdmin(): Admin {
  return {
    id: "admin-1",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD, // Will be hashed during authentication
    name: ADMIN_NAME,
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Get admin by email
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    const admin = getDefaultAdmin();
    if (admin.email.toLowerCase() === email.toLowerCase()) {
      return admin;
    }
    return null;
  } catch (error) {
    console.error("Error getting admin by email:", error);
    return null;
  }
}

// Get admin by ID
export async function getAdminById(id: string): Promise<Admin | null> {
  try {
    const admin = getDefaultAdmin();
    if (admin.id === id) {
      return admin;
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

// Authenticate admin
export async function authenticateAdmin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const { email, password } = credentials;

    // Get admin by email
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify password - check if admin password is already hashed or plain text
    let isValidPassword = false;

    // If the stored password looks like a bcrypt hash, compare directly
    if (
      admin.password.startsWith("$2a$") ||
      admin.password.startsWith("$2b$")
    ) {
      isValidPassword = await bcrypt.compare(password, admin.password);
    } else {
      // If it's plain text (for environment variables), compare directly for now
      // In production, you should set ADMIN_PASSWORD to a hashed value
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
