import { API_BASE_URL } from './config';
import { getAuthToken } from './laravel-auth';

export type UserRole = 'super_admin' | 'events' | 'news' | 'user_management';

// Legacy role types for backward compatibility
export type LegacyUserRole = 'super_admin' | 'events_manager' | 'news_manager' | 'user_manager';

// All possible role types
export type AllUserRoles = UserRole | LegacyUserRole;

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  role?: string; // For backward compatibility - first role
  is_active: boolean;
  isActive: boolean; // For backward compatibility
  last_login?: string;
  lastLogin?: string; // For backward compatibility
  created_at: string;
  createdAt: string; // For backward compatibility
  updated_at: string;
  updatedAt: string; // For backward compatibility
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];
  is_active?: boolean;
  isActive?: boolean; // For backward compatibility
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
}

export interface UsersResponse {
  success: boolean;
  users?: User[];
  error?: string;
}

export interface UserResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

export interface RolesResponse {
  success: boolean;
  roles?: Role[];
  error?: string;
}

// Note: getAuthToken is now imported from laravel-auth.ts to use consistent token storage

// Make authenticated API request
async function makeAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('API Request Failed:', {
      url,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// Get all users
export async function getAllUsers(): Promise<UsersResponse> {
  try {
    const response = await makeAuthenticatedRequest('/api/users');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users'
    };
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<UserResponse> {
  try {
    const response = await makeAuthenticatedRequest(`/api/users/${id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user'
    };
  }
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<UserResponse> {
  try {
    const response = await makeAuthenticatedRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    };
  }
}

// Update user
export async function updateUser(id: string, userData: UpdateUserData): Promise<UserResponse> {
  try {
    const response = await makeAuthenticatedRequest(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    };
  }
}

// Delete user (soft delete)
export async function deleteUser(id: string): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const response = await makeAuthenticatedRequest(`/api/users/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    };
  }
}

// Toggle user status
export async function toggleUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
  try {
    const response = await makeAuthenticatedRequest(`/api/users/${id}/toggle-status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error toggling user status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user status'
    };
  }
}

// Get available roles
export async function getRoles(): Promise<RolesResponse> {
  try {
    const response = await makeAuthenticatedRequest('/api/roles');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch roles'
    };
  }
}

// Helper function to check if user has specific role
export function hasRole(user: User, roleName: string): boolean {
  return user.roles?.includes(roleName) || false;
}

// Helper function to check if user has any of the given roles
export function hasAnyRole(user: User, roleNames: string[]): boolean {
  if (!user.roles) return false;
  return roleNames.some(role => user.roles.includes(role));
}

// Helper function to check if user has all of the given roles
export function hasAllRoles(user: User, roleNames: string[]): boolean {
  if (!user.roles) return false;
  return roleNames.every(role => user.roles.includes(role));
}

// Helper function to check if user is super admin
export function isSuperAdmin(user: User): boolean {
  return hasRole(user, 'super_admin');
}

// Helper function to format user roles for display
export function getFormattedRoles(user: User, roles: Role[] = []): string {
  if (!user.roles || user.roles.length === 0) return 'No roles';
  
  const roleMap = roles.reduce((map, role) => {
    map[role.name] = role.display_name;
    return map;
  }, {} as Record<string, string>);
  
  return user.roles
    .map(roleName => roleMap[roleName] || roleName)
    .join(', ');
}