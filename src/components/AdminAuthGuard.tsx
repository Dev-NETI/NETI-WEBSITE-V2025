"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

interface AuthResponse {
  success: boolean;
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const result: AuthResponse = await response.json();

        if (result.success && result.admin) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          // Redirect to login page
          setTimeout(() => {
            router.push("/admin/login");
          }, 2000);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setError("Failed to verify authentication");
        setAuthenticated(false);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <p className="text-slate-700 font-semibold">
              Verifying authentication...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 max-w-md">
            <div className="bg-red-100 p-4 rounded-2xl mb-6">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-slate-600 mb-6">
              {error || "You need to be logged in to access this page."}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
              Redirecting to login page...
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
