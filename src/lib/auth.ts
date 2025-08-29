import { promises as fs } from "fs";
import path from "path";
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

const DB_PATH = path.join(process.cwd(), "data");
const ADMINS_FILE = path.join(DB_PATH, "admins.json");
const SESSIONS_FILE = path.join(DB_PATH, "sessions.json");

// JWT secret - in production, this should be an environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || "neti-admin-secret-key-change-in-production";

// Ensure database directory exists
async function ensureDbPath() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true });
  }
}

// Initialize admins database with default admin
async function initializeAdminsDb() {
  const defaultPassword = await bcrypt.hash("admin123", 12);
  const initialAdmins: Admin[] = [
    {
      id: "admin-1",
      email: "admin@neti.com.ph",
      password: defaultPassword,
      name: "NETI Administrator",
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    await fs.writeFile(ADMINS_FILE, JSON.stringify(initialAdmins, null, 2));
  } catch (error) {
    console.error("Error initializing admins database:", error);
    throw error;
  }
}

// Initialize sessions database
async function initializeSessionsDb() {
  const initialSessions: Session[] = [];

  try {
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(initialSessions, null, 2));
  } catch (error) {
    console.error("Error initializing sessions database:", error);
    throw error;
  }
}

// Read all admins
export async function getAllAdmins(): Promise<Admin[]> {
  try {
    await ensureDbPath();

    try {
      const data = await fs.readFile(ADMINS_FILE, "utf8");
      return JSON.parse(data);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        // File doesn't exist, initialize it
        await initializeAdminsDb();
        const data = await fs.readFile(ADMINS_FILE, "utf8");
        return JSON.parse(data);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error reading admins:", error);
    return [];
  }
}

// Get admin by email
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    const admins = await getAllAdmins();
    return (
      admins.find(
        (admin) => admin.email.toLowerCase() === email.toLowerCase()
      ) || null
    );
  } catch (error) {
    console.error("Error getting admin by email:", error);
    return null;
  }
}

// Get admin by ID
export async function getAdminById(id: string): Promise<Admin | null> {
  try {
    const admins = await getAllAdmins();
    return admins.find((admin) => admin.id === id) || null;
  } catch (error) {
    console.error("Error getting admin by ID:", error);
    return null;
  }
}

// Read all sessions
export async function getAllSessions(): Promise<Session[]> {
  try {
    await ensureDbPath();

    try {
      const data = await fs.readFile(SESSIONS_FILE, "utf8");
      return JSON.parse(data);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        // File doesn't exist, initialize it
        await initializeSessionsDb();
        const data = await fs.readFile(SESSIONS_FILE, "utf8");
        return JSON.parse(data);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error reading sessions:", error);
    return [];
  }
}

// Create session
export async function createSession(adminId: string): Promise<string> {
  try {
    const sessions = await getAllSessions();
    const token = jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "24h" });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const newSession: Session = {
      id: `session-${Date.now()}`,
      adminId,
      token,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    sessions.push(newSession);
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    return token;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

// Verify token and get admin
export async function verifyToken(token: string): Promise<Admin | null> {
  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };

    // Check if session exists and is valid
    const sessions = await getAllSessions();
    const session = sessions.find(
      (s) => s.token === token && new Date(s.expiresAt) > new Date()
    );

    if (!session) {
      return null;
    }

    // Get admin
    const admin = await getAdminById(decoded.adminId);
    return admin;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

// Delete session (logout)
export async function deleteSession(token: string): Promise<boolean> {
  try {
    const sessions = await getAllSessions();
    const filteredSessions = sessions.filter((s) => s.token !== token);

    if (filteredSessions.length === sessions.length) {
      return false; // Session not found
    }

    await fs.writeFile(
      SESSIONS_FILE,
      JSON.stringify(filteredSessions, null, 2)
    );
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
}

// Clean expired sessions
export async function cleanExpiredSessions(): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const now = new Date();
    const validSessions = sessions.filter((s) => new Date(s.expiresAt) > now);

    if (validSessions.length !== sessions.length) {
      await fs.writeFile(SESSIONS_FILE, JSON.stringify(validSessions, null, 2));
    }
  } catch (error) {
    console.error("Error cleaning expired sessions:", error);
  }
}

// Authenticate admin
export async function authenticateAdmin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    // Clean expired sessions first
    await cleanExpiredSessions();

    const { email, password } = credentials;

    // Get admin by email
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session token
    const token = await createSession(admin.id);

    // Update last login
    const admins = await getAllAdmins();
    const adminIndex = admins.findIndex((a) => a.id === admin.id);
    if (adminIndex !== -1) {
      admins[adminIndex].lastLogin = new Date().toISOString();
      admins[adminIndex].updatedAt = new Date().toISOString();
      await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2));
    }

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

// Create admin utility (for future use)
export async function createAdmin(
  adminData: Omit<Admin, "id" | "createdAt" | "updatedAt" | "password"> & {
    password: string;
  }
): Promise<Admin> {
  try {
    const admins = await getAllAdmins();
    const hashedPassword = await hashPassword(adminData.password);

    const newAdmin: Admin = {
      ...adminData,
      password: hashedPassword,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2));
    return newAdmin;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}
