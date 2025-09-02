"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  Edit,
  ArrowLeft,
  UserCheck,
  UserX,
  Activity,
  Settings,
  Eye,
  RotateCcw,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getUserById, toggleUserStatus, deleteUser, User as LaravelUser } from "@/lib/laravel-user";
import Image from "next/image";

const ROLE_COLORS = {
  super_admin: "bg-red-100 text-red-800 border-red-200",
  user_manager: "bg-blue-100 text-blue-800 border-blue-200",
  events_manager: "bg-green-100 text-green-800 border-green-200",
  news_manager: "bg-purple-100 text-purple-800 border-purple-200",
};

const ROLE_LABELS = {
  super_admin: "Super Administrator",
  user_manager: "User Manager",
  events_manager: "Events Manager",
  news_manager: "News Manager",
};

const ROLE_DESCRIPTIONS = {
  super_admin: "Full system access and user management",
  user_manager: "Can manage users and their permissions",
  events_manager: "Can create, edit, and manage events",
  news_manager: "Can create, edit, and manage news articles",
};

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const { canManageUsers } = usePermissions();
  const { admin } = useAuth();

  const [user, setUser] = useState<LaravelUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await getUserById(userId);

      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setError(result.error || "Failed to fetch user");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && (canManageUsers || admin?.id === userId)) {
      fetchUser();
    } else if (userId) {
      setError("Insufficient permissions to view this user");
      setLoading(false);
    }
  }, [userId, canManageUsers, admin?.id, fetchUser]);

  const handleToggleStatus = async () => {
    if (!user || !canManageUsers || user.id === admin?.id) return;

    const action = user.isActive ? "deactivate" : "reactivate";
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      setUpdating(true);
      const result = await toggleUserStatus(user.id, !user.isActive);

      if (result.success) {
        await fetchUser(); // Refresh user data
      } else {
        alert(result.error || `Failed to ${action} user`);
      }
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
      alert("Network error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user || !canManageUsers || user.id === admin?.id) return;

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setUpdating(true);
      const result = await deleteUser(user.id);

      if (result.success) {
        alert("User deleted successfully");
        window.location.href = "/admin/users";
      } else {
        alert(result.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Network error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (!canManageUsers && admin?.id !== userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to view this user.
          </p>
        </div>
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
                    {admin?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ROLE_LABELS[admin?.role as keyof typeof ROLE_LABELS] || admin?.role || "User"}
                  </p>
                </div>

                <button
                  onClick={() => (window.location.href = "/admin/users")}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
              />
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-medium text-red-900">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          ) : user ? (
            <div className="space-y-6">
              {/* User Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          {user.name}
                          {user.isActive ? (
                            <UserCheck className="w-6 h-6 text-green-600" />
                          ) : (
                            <UserX className="w-6 h-6 text-red-600" />
                          )}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
                              ROLE_COLORS[(user.role || user.roles?.[0]) as keyof typeof ROLE_COLORS] ||
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {ROLE_LABELS[(user.role || user.roles?.[0]) as keyof typeof ROLE_LABELS] || (user.role || user.roles?.[0])}
                          </span>
                        </div>
                      </div>
                    </div>

                    {canManageUsers && user.id !== admin?.id && (
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => (window.location.href = `/admin/users/${user.id}/edit`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          disabled={updating}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </motion.button>
                        
                        {!user.isActive ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleToggleStatus}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                            disabled={updating}
                          >
                            <RotateCcw className="w-4 h-4" />
                            Reactivate
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDeleteUser}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            disabled={updating}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-md"
                >
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      Account Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                          <button
                            onClick={canManageUsers && user.id !== admin?.id ? handleToggleStatus : undefined}
                            className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border transition-colors ${
                              user.isActive
                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                            } ${canManageUsers && user.id !== admin?.id ? 'cursor-pointer' : 'cursor-default'}`}
                            disabled={updating}
                          >
                            {user.isActive ? (
                              <UserCheck className="w-3 h-3" />
                            ) : (
                              <UserX className="w-3 h-3" />
                            )}
                            {user.isActive ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created</label>
                        <div className="mt-1 flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(user.createdAt || user.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                        <div className="mt-1 flex items-center gap-2 text-gray-900">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {new Date(user.updatedAt || user.updated_at).toLocaleString()}
                        </div>
                      </div>
                      {(user.lastLogin || user.last_login) && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Login</label>
                          <div className="mt-1 flex items-center gap-2 text-gray-900">
                            <Activity className="w-4 h-4 text-gray-400" />
                            {new Date(user.lastLogin || user.last_login!).toLocaleString()}
                          </div>
                        </div>
                      )}
                      {user.createdBy && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created By</label>
                          <div className="mt-1 text-gray-900">
                            {user.createdBy}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Role & Permissions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-md"
                >
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Role & Permissions
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Current Role</label>
                        <div className="mt-2">
                          <span
                            className={`inline-flex px-3 py-2 text-sm font-medium rounded-lg border ${
                              ROLE_COLORS[(user.role || user.roles?.[0]) as keyof typeof ROLE_COLORS] ||
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {ROLE_LABELS[(user.role || user.roles?.[0]) as keyof typeof ROLE_LABELS] || (user.role || user.roles?.[0])}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="mt-1 text-gray-700">
                          {ROLE_DESCRIPTIONS[(user.role || user.roles?.[0]) as keyof typeof ROLE_DESCRIPTIONS] || "No description available"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Permissions</label>
                        <div className="mt-2 space-y-2">
                          {((user.role || user.roles?.[0]) === "super_admin") && (
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <Settings className="w-4 h-4" />
                              <span>Full system administration</span>
                            </div>
                          )}
                          {((user.role || user.roles?.[0]) === "user_manager" || (user.role || user.roles?.[0]) === "super_admin") && (
                            <div className="flex items-center gap-2 text-sm text-blue-700">
                              <User className="w-4 h-4" />
                              <span>User management</span>
                            </div>
                          )}
                          {((user.role || user.roles?.[0]) === "events_manager" || (user.role || user.roles?.[0]) === "super_admin") && (
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <Calendar className="w-4 h-4" />
                              <span>Events management</span>
                            </div>
                          )}
                          {((user.role || user.roles?.[0]) === "news_manager" || (user.role || user.roles?.[0]) === "super_admin") && (
                            <div className="flex items-center gap-2 text-sm text-purple-700">
                              <Eye className="w-4 h-4" />
                              <span>News management</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}