"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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
      
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (result.success && result.admin) {
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
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (result.success && result.admin) {
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
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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