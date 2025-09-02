"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import type { UserRole } from '@/lib/laravel-user';

// Client-side permissions mapping for new role system
const PERMISSIONS: Record<string, string[]> = {
  super_admin: ['users', 'events', 'news', 'settings'],
  user_management: ['users'],
  events: ['events'],  
  news: ['news'],
  // Legacy roles for backward compatibility
  user_manager: ['users'],
  events_manager: ['events'],
  news_manager: ['news'],
  admin: ['users', 'events', 'news', 'settings']
};

// Debug function to help troubleshoot permissions
function debugPermissions(userRoles: string[], permission: string) {
  console.log('🔍 Permission Debug:', {
    userRoles,
    checkingPermission: permission,
    rolePermissions: userRoles.map(role => ({
      role,
      permissions: PERMISSIONS[role] || []
    })),
    hasPermission: userRoles.some(role => PERMISSIONS[role]?.includes(permission))
  });
}

function hasPermissionForRole(role: string, permission: string): boolean {
  return PERMISSIONS[role]?.includes(permission) || false;
}

// Helper function to get permissions from multiple roles
function getPermissionsFromRoles(roles: string[]): string[] {
  const allPermissions = new Set<string>();
  roles.forEach(role => {
    const rolePermissions = PERMISSIONS[role] || [];
    rolePermissions.forEach(permission => allPermissions.add(permission));
  });
  return Array.from(allPermissions);
}

export interface UsePermissionsReturn {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canManageUsers: boolean;
  canManageEvents: boolean;
  canManageNews: boolean;
  canManageSettings: boolean;
  isSuperAdmin: boolean;
  userRole: UserRole | null;
  userRoles: string[];
  permissions: readonly string[];
}

export function usePermissions(): UsePermissionsReturn {
  const { admin } = useAuth();
  const [permissions, setPermissions] = useState<readonly string[]>([]);
  
  // Memoize user roles to prevent infinite loop
  const userRoles = useMemo(() => {
    const roles = admin?.roles || (admin?.role ? [admin.role] : []);
    console.log('👤 User admin object:', {
      adminData: admin,
      extractedRoles: roles,
      adminRoles: admin?.roles,
      adminRole: admin?.role
    });
    return roles;
  }, [admin?.roles, admin?.role]);
  
  const userRole = userRoles[0] as UserRole || null; // Primary role for backward compatibility
  
  useEffect(() => {
    if (userRoles.length > 0) {
      const allPermissions = getPermissionsFromRoles(userRoles);
      setPermissions(allPermissions);
    } else {
      setPermissions([]);
    }
  }, [userRoles]);
  
  const checkPermission = (permission: string): boolean => {
    if (userRoles.length === 0) {
      console.log('🚫 No user roles found');
      return false;
    }
    
    // Debug permissions
    debugPermissions(userRoles, permission);
    
    const hasPermission = userRoles.some(role => hasPermissionForRole(role, permission));
    console.log(`✅ Permission check result for "${permission}":`, hasPermission);
    
    return hasPermission;
  };
  
  const checkAnyPermission = (requiredPermissions: string[]): boolean => {
    if (userRoles.length === 0) return false;
    return requiredPermissions.some(permission => checkPermission(permission));
  };
  
  const checkAllPermissions = (requiredPermissions: string[]): boolean => {
    if (userRoles.length === 0) return false;
    return requiredPermissions.every(permission => checkPermission(permission));
  };
  
  const isSuperAdmin = userRoles.includes('super_admin') || userRoles.includes('admin');
  
  return {
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    canManageUsers: checkPermission('users'),
    canManageEvents: checkPermission('events'),
    canManageNews: checkPermission('news'),
    canManageSettings: checkPermission('settings'),
    isSuperAdmin,
    userRole,
    userRoles,
    permissions
  };
}