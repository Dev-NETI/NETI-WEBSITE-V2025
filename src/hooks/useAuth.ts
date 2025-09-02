"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  loginToLaravel, 
  verifyLaravelToken, 
  logoutFromLaravel 
} from "@/lib/laravel-auth";

interface Admin {
  id: string;
  email: string;
  name: string;
  role?: string; // For backward compatibility - primary role
  roles?: string[]; // Multiple roles array from Laravel
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface AuthState {
  admin: Admin | null;
  loading: boolean;
  authenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    admin: null,
    loading: true,
    authenticated: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const result = await verifyLaravelToken();
      
      if (result.success && result.admin) {
        console.log('🔍 Laravel Auth Response:', result);
        console.log('🔍 Admin Data Received:', result.admin);
        setState({
          admin: result.admin,
          loading: false,
          authenticated: true,
        });
      } else {
        setState({
          admin: null,
          loading: false,
          authenticated: false,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setState({
        admin: null,
        loading: false,
        authenticated: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const result = await loginToLaravel(email, password);
      
      if (result.success && result.admin) {
        console.log('🔍 Login Success - Admin Data:', result.admin);
        setState({
          admin: result.admin,
          loading: false,
          authenticated: true,
        });
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          authenticated: false,
        }));
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        authenticated: false,
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutFromLaravel();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setState({
        admin: null,
        loading: false,
        authenticated: false,
      });
      router.push("/admin/login");
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
}