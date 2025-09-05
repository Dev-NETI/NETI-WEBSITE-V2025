"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Newspaper,
  Clock,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Image from "next/image";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  upcomingEvents: number;
  recentLogins: number;
  systemHealth: "good" | "warning" | "error";
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  permission?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, logout } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    recentLogins: 0,
    systemHealth: "good",
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate fetching dashboard stats
    const fetchStats = async () => {
      // In a real app, these would be API calls
      setStats({
        totalUsers: 24,
        activeUsers: 18,
        totalEvents: 12,
        upcomingEvents: 8,
        recentLogins: 5,
        systemHealth: "good",
      });
    };

    fetchStats();
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: "User Management",
      description: "Create, edit, and manage system users",
      icon: <Users className="w-6 h-6" />,
      href: "/admin/users",
      color: "from-blue-500 to-blue-600",
      permission: "users",
    },
    {
      title: "Events Management",
      description: "Create and manage training events",
      icon: <Calendar className="w-6 h-6" />,
      href: "/admin/events",
      color: "from-green-500 to-green-600",
      permission: "events",
    },
    {
      title: "News Management",
      description: "Create and manage news articles",
      icon: <Newspaper className="w-6 h-6" />,
      href: "/admin/news",
      color: "from-purple-500 to-purple-600",
      permission: "news",
    },
  ];

  // Get user's roles from Laravel Sanctum auth (from UserRole model)
  // Use roles array if available, fallback to single role for backward compatibility
  const userRoles = admin?.roles || (admin?.role ? [admin.role] : []);

  console.log("🔍 DASHBOARD DEBUG - Laravel Auth Data:", {
    admin,
    userRoles,
    hasRoles: userRoles.length > 0,
    adminStringified: JSON.stringify(admin, null, 2),
  });

  // Role to action mapping - each role manages their specific area
  const ROLE_TO_ACTIONS: Record<string, string[]> = {
    user_manager: ["users"], // User Management role sees only users
    events_manager: ["events"], // Events Management role sees only events
    news_manager: ["news"], // News Management role sees only news
    super_admin: ["users", "events", "news"], // Super admin sees everything
  };

  // Filter actions based on user's Laravel Sanctum roles (from UserRole model)
  const filteredActions = quickActions.filter((action) => {
    // If no permission required, show to everyone
    if (!action.permission) return true;

    // If no user roles, show nothing
    if (!userRoles || userRoles.length === 0) return false;

    // Check if ANY of the user's roles allows this action
    const allowedByAnyRole = userRoles.some((role) => {
      const allowedActions = ROLE_TO_ACTIONS[role] || [];
      return allowedActions.includes(action.permission!);
    });

    console.log(`🔍 Checking action "${action.title}":`, {
      userRoles,
      permission: action.permission,
      allowedByAnyRole,
      rolePermissions: userRoles.map((role) => ({
        role,
        actions: ROLE_TO_ACTIONS[role] || [],
      })),
    });

    return allowedByAnyRole;
  });

  // Debug logging
  console.log("🔍 Dashboard Debug:", {
    adminData: admin,
    userRoles,
    filteredActionsCount: filteredActions.length,
    filteredActions: filteredActions.map((a) => a.title),
    allRoleActions: userRoles.flatMap((role) => ROLE_TO_ACTIONS[role] || []),
  });

  const handleLogout = async () => {
    await logout();
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/images/NETI.svg"
                  alt="NETI Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    NETI Admin Panel
                  </h1>
                  <p className="text-sm text-gray-600">
                    NYK-Fil Maritime E-Training, Inc.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {admin.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRoles.length > 0
                      ? userRoles.join(", ").replace(/_/g, " ")
                      : "No roles"}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back, {admin.name}!
                  </h2>
                  <p className="text-blue-100 mb-4">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    •{" "}
                    {currentTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-blue-100">
                      System Status: Online
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-200" />
                    <span className="text-sm text-blue-100">
                      Last login: Today
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.totalUsers}
                  </p>
                  <p className="text-lg text-gray-600 mb-1">Total Users</p>
                  <p className="text-sm text-gray-400">
                    System-wide registrations
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.totalEvents}
                  </p>
                  <p className="text-lg text-gray-600 mb-1">Total Events</p>
                  <p className="text-sm text-gray-400">
                    Training programs available
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => router.push(action.href)}
                    className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-left hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />

                    <div className="relative z-10">
                      <div
                        className={`inline-flex p-4 bg-gradient-to-br ${action.color} rounded-2xl text-white mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        {action.icon}
                      </div>
                      <h4 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {action.title}
                      </h4>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {action.description}
                      </p>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  System Status
                </h3>
                <p className="text-gray-600 mb-4">
                  All systems operational and running smoothly
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-700">
                      Database Connected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-blue-700">
                      API Services Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-purple-700">
                      Authentication Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600 mb-1">
                  99.9%
                </div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
