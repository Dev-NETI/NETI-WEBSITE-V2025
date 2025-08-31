import { executeQuery, executeInsert, executeUpdate } from "./mysql";
import bcrypt from "bcryptjs";

export type UserRole =
  | "super_admin"
  | "events_manager"
  | "news_manager"
  | "user_manager";

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Optional for response objects
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  createdBy?: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  createdBy: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Create users table if it doesn't exist
export async function initializeUserTable(): Promise<void> {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'events_manager', 'news_manager', 'user_manager') NOT NULL,
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        lastLogin TIMESTAMP NULL,
        createdBy INT NULL,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `;

    await executeQuery(createTableQuery);

    // Check if super admin exists, if not create one
    const existingAdmin = await getUserByEmail("admin@neti.com.ph");
    if (!existingAdmin) {
      await createDefaultSuperAdmin();
    }

    console.log("Users table initialized successfully");
  } catch (error) {
    console.error("Error initializing users table:", error);
    throw error;
  }
}

async function createDefaultSuperAdmin(): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const query = `
      INSERT INTO users (email, name, password, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    await executeQuery(query, [
      "admin@neti.com.ph",
      "NETI Super Administrator",
      hashedPassword,
      "super_admin",
    ]);

    console.log("Default super admin created successfully");
  } catch (error) {
    console.error("Error creating default super admin:", error);
    throw error;
  }
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const query = `
      SELECT 
        id,
        email,
        name,
        role,
        isActive,
        createdAt,
        updatedAt,
        lastLogin,
        createdBy
      FROM users 
      ORDER BY createdAt DESC
    `;

    const users = await executeQuery<User>(query);

    return users.map((user) => ({
      ...user,
      id: user.id.toString(),
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
      lastLogin: user.lastLogin
        ? new Date(user.lastLogin).toISOString()
        : undefined,
      createdBy: user.createdBy?.toString(),
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const query = `
      SELECT 
        id,
        email,
        name,
        password,
        role,
        isActive,
        createdAt,
        updatedAt,
        lastLogin,
        createdBy
      FROM users 
      WHERE id = ?
      LIMIT 1
    `;

    const users = await executeQuery<User>(query, [id]);

    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    return {
      ...user,
      id: user.id.toString(),
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
      lastLogin: user.lastLogin
        ? new Date(user.lastLogin).toISOString()
        : undefined,
      createdBy: user.createdBy?.toString(),
    };
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const query = `
      SELECT 
        id,
        email,
        name,
        password,
        role,
        isActive,
        createdAt,
        updatedAt,
        lastLogin,
        createdBy
      FROM users 
      WHERE email = ? AND isActive = true
      LIMIT 1
    `;

    const users = await executeQuery<User>(query, [email]);

    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    return {
      ...user,
      id: user.id.toString(),
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
      lastLogin: user.lastLogin
        ? new Date(user.lastLogin).toISOString()
        : undefined,
      createdBy: user.createdBy?.toString(),
    };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    // Check if email already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const query = `
      INSERT INTO users (
        email,
        name,
        password,
        role,
        createdBy,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await executeInsert(query, [
      userData.email,
      userData.name,
      hashedPassword,
      userData.role,
      userData.createdBy,
    ]);

    const insertId = result.insertId;
    const createdUser = await getUserById(insertId.toString());

    if (!createdUser) {
      throw new Error("Failed to retrieve created user");
    }

    // Remove password from response
    const {
      // password: _password,
      ...userResponse
    } = createdUser;

    console.log(`Successfully created user: ${createdUser.email}`);
    return userResponse as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user
export async function updateUser(
  id: string,
  userData: UpdateUserData
): Promise<User | null> {
  try {
    const updateFields: string[] = [];
    const values: unknown[] = [];

    // Build dynamic update query
    if (userData.email !== undefined) {
      // Check if new email already exists (exclude current user)
      const existingUser = await getUserByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("User with this email already exists");
      }
      updateFields.push("email = ?");
      values.push(userData.email);
    }

    if (userData.name !== undefined) {
      updateFields.push("name = ?");
      values.push(userData.name);
    }

    if (userData.password !== undefined) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      updateFields.push("password = ?");
      values.push(hashedPassword);
    }

    if (userData.role !== undefined) {
      updateFields.push("role = ?");
      values.push(userData.role);
    }

    if (userData.isActive !== undefined) {
      updateFields.push("isActive = ?");
      values.push(userData.isActive);
    }

    if (updateFields.length === 0) {
      return await getUserById(id);
    }

    // Add updatedAt field
    updateFields.push("updatedAt = NOW()");
    values.push(id); // for WHERE clause

    const query = `
      UPDATE users 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    await executeQuery(query, values);

    const updatedUser = await getUserById(id);

    if (updatedUser) {
      // Remove password from response
      const {
        // password: _password,
        ...userResponse
      } = updatedUser;
      console.log(`Successfully updated user: ${updatedUser.email}`);
      return userResponse as User;
    }

    return null;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete user (soft delete by setting isActive = false)
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const query =
      "UPDATE users SET isActive = false, updatedAt = NOW() WHERE id = ?";
    const result = await executeUpdate(query, [id]);

    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      console.log(`No user found with ID: ${id}`);
      return false;
    }

    console.log(`Successfully deactivated user with ID: ${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

// Authenticate user
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const user = await getUserByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await executeQuery("UPDATE users SET lastLogin = NOW() WHERE id = ?", [
      user.id,
    ]);

    // Remove password from response
    const {
      // password: _password,
      ...userResponse
    } = user;

    return userResponse as User;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
}

// Update last login
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await executeQuery("UPDATE users SET lastLogin = NOW() WHERE id = ?", [
      userId,
    ]);
  } catch (error) {
    console.error("Error updating last login:", error);
  }
}

// Get users by role
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  try {
    const query = `
      SELECT 
        id,
        email,
        name,
        role,
        isActive,
        createdAt,
        updatedAt,
        lastLogin,
        createdBy
      FROM users 
      WHERE role = ? AND isActive = true
      ORDER BY createdAt DESC
    `;

    const users = await executeQuery<User>(query, [role]);

    return users.map((user) => ({
      ...user,
      id: user.id.toString(),
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
      lastLogin: user.lastLogin
        ? new Date(user.lastLogin).toISOString()
        : undefined,
      createdBy: user.createdBy?.toString(),
    }));
  } catch (error) {
    console.error("Error getting users by role:", error);
    throw error;
  }
}
