import bcrypt from "bcryptjs";
import { DatabaseResult } from "./db";
import { usersDB, UserDocument } from "./document-db";

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

// Get all users
export async function getAllUsers(): Promise<DatabaseResult<User[]>> {
  try {
    const result = await usersDB.findWhere((user) => user.isActive);
    if (!result.success || !result.data) {
      return result;
    }

    // Convert UserDocument to User format
    const users: User[] = result.data.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
      createdBy: user.createdBy,
    }));

    return { success: true, data: users };
  } catch (error) {
    console.error("Error getting all users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get users",
    };
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<DatabaseResult<User>> {
  try {
    const result = await usersDB.findOne(
      (user) => user.id === id && user.isActive
    );
    if (!result.success || !result.data) {
      return result;
    }

    // Convert UserDocument to User format
    const user: User = {
      id: result.data.id,
      email: result.data.email,
      name: result.data.name,
      password: result.data.password,
      role: result.data.role,
      isActive: result.data.isActive,
      createdAt: result.data.createdAt,
      updatedAt: result.data.updatedAt,
      lastLogin: result.data.lastLogin,
      createdBy: result.data.createdBy,
    };

    return { success: true, data: user };
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user",
    };
  }
}

// Get user by email
export async function getUserByEmail(
  email: string
): Promise<DatabaseResult<User>> {
  try {
    const result = await usersDB.findOne(
      (user) => user.email === email && user.isActive
    );
    if (!result.success || !result.data) {
      return result;
    }

    // Convert UserDocument to User format
    const user: User = {
      id: result.data.id,
      email: result.data.email,
      name: result.data.name,
      password: result.data.password,
      role: result.data.role,
      isActive: result.data.isActive,
      createdAt: result.data.createdAt,
      updatedAt: result.data.updatedAt,
      lastLogin: result.data.lastLogin,
      createdBy: result.data.createdBy,
    };

    return { success: true, data: user };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user",
    };
  }
}

// Create new user
export async function createUser(
  userData: CreateUserData
): Promise<DatabaseResult<User>> {
  try {
    // Check if email already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser.success) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const now = new Date().toISOString();

    const newUser: Omit<UserDocument, "id"> = {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      role: userData.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userData.createdBy,
    };

    const result = await usersDB.create(newUser);
    if (!result.success || !result.data) {
      return result;
    }

    // Convert to User format (without password)
    const {
      // password: _password,
      ...userResponse
    } = result.data;
    return { success: true, data: userResponse as User };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

// Update user
export async function updateUser(
  id: string,
  userData: UpdateUserData
): Promise<DatabaseResult<User>> {
  try {
    // Check if new email already exists (exclude current user)
    if (userData.email !== undefined) {
      const existingUser = await usersDB.findOne(
        (user) => user.email === userData.email && user.id !== id
      );
      if (existingUser.success) {
        return { success: false, error: "User with this email already exists" };
      }
    }

    const updates: Partial<UserDocument> = {
      updatedAt: new Date().toISOString(),
    };

    if (userData.email !== undefined) updates.email = userData.email;
    if (userData.name !== undefined) updates.name = userData.name;
    if (userData.role !== undefined) updates.role = userData.role;
    if (userData.isActive !== undefined) updates.isActive = userData.isActive;

    if (userData.password !== undefined) {
      updates.password = await bcrypt.hash(userData.password, 12);
    }

    const result = await usersDB.update(id, updates);
    if (!result.success || !result.data) {
      return result;
    }

    // Convert to User format (without password)
    const {
      // password: _password,
      ...userResponse
    } = result.data;
    return { success: true, data: userResponse as User };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

// Delete user (soft delete)
export async function deleteUser(id: string): Promise<DatabaseResult<boolean>> {
  try {
    const result = await usersDB.update(id, {
      isActive: false,
      updatedAt: new Date().toISOString(),
    });

    if (!result.success) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}

// Authenticate user
export async function authenticateUser(
  email: string,
  password: string
): Promise<DatabaseResult<User>> {
  try {
    const userResult = await getUserByEmail(email);

    if (!userResult.success || !userResult.data || !userResult.data.password) {
      return { success: false, error: "Invalid credentials" };
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userResult.data.password
    );

    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" };
    }

    // Update last login
    await usersDB.update(userResult.data.id, {
      lastLogin: new Date().toISOString(),
    });

    // Remove password from response
    const {
      // password: _password,
      ...userResponse
    } = userResult.data;

    return { success: true, data: userResponse as User };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

// Get users by role
export async function getUsersByRole(
  role: UserRole
): Promise<DatabaseResult<User[]>> {
  try {
    const result = await usersDB.findWhere(
      (user) => user.role === role && user.isActive
    );
    if (!result.success || !result.data) {
      return result;
    }

    // Convert UserDocument to User format
    const users: User[] = result.data.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
      createdBy: user.createdBy,
    }));

    return { success: true, data: users };
  } catch (error) {
    console.error("Error getting users by role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get users by role",
    };
  }
}
