"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { UserRole } from '@/lib/user';

// Client-side permissions mapping
const PERMISSIONS = {
  super_admin: ['users', 'events', 'news', 'settings'],
  user_manager: ['users'],
  events_manager: ['events'],
  news_manager: ['news'],
  admin: ['users', 'events', 'news', 'settings'] // Legacy admin role
} as const;

function hasPermission(userRole: UserRole | 'admin', permission: string): boolean {
  return PERMISSIONS[userRole as keyof typeof PERMISSIONS]?.includes(permission as 'users' | 'events' | 'news' | 'settings') || false;
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
  permissions: readonly string[];
}

export function usePermissions(): UsePermissionsReturn {
  const { admin } = useAuth();
  const [permissions, setPermissions] = useState<readonly string[]>([]);
  
  const userRole = admin?.role as UserRole || null;
  
  useEffect(() => {
    if (userRole) {
      const rolePermissions = PERMISSIONS[userRole as keyof typeof PERMISSIONS] || [];
      setPermissions(rolePermissions);
    } else {
      setPermissions([]);
    }
  }, [userRole]);
  
  const checkPermission = (permission: string): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole as UserRole | 'admin', permission);
  };
  
  const checkAnyPermission = (requiredPermissions: string[]): boolean => {
    if (!userRole) return false;
    return requiredPermissions.some(permission => hasPermission(userRole as UserRole | 'admin', permission));
  };
  
  const checkAllPermissions = (requiredPermissions: string[]): boolean => {
    if (!userRole) return false;
    return requiredPermissions.every(permission => hasPermission(userRole as UserRole | 'admin', permission));
  };
  
  return {
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    canManageUsers: checkPermission('users'),
    canManageEvents: checkPermission('events'),
    canManageNews: checkPermission('news'),
    canManageSettings: checkPermission('settings'),
    isSuperAdmin: userRole === 'super_admin' || userRole === 'admin',
    userRole,
    permissions
  };
}