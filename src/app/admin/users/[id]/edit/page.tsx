"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  UserCheck,
  UserX
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import type { User, Role, UpdateUserData } from "@/lib/laravel-user";
import { 
  getUserById, 
  updateUser, 
  getRoles 
} from "@/lib/laravel-user";
import Image from "next/image";

const ROLE_LABELS = {
  super_admin: "Super Admin",
  user_management: "User Management", 
  events: "Events Management",
  news: "News Management"
};

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
  is_active: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  roles?: string;
  general?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { admin } = useAuth();
  const { canManageUsers } = usePermissions();
  
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: [],
    is_active: true
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!canManageUsers) return;
      
      try {
        setLoading(true);
        
        const [userResult, rolesResult] = await Promise.all([
          getUserById(userId),
          getRoles()
        ]);
        
        if (userResult.success && userResult.user) {
          setUser(userResult.user);
          setFormData({
            name: userResult.user.name,
            email: userResult.user.email,
            password: "",
            confirmPassword: "",
            roles: userResult.user.roles || [],
            is_active: userResult.user.is_active
          });
        } else {
          setErrors({ general: userResult.error || "Failed to load user" });
        }
        
        if (rolesResult.success && rolesResult.roles) {
          setRoles(rolesResult.roles);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ general: "Network error occurred" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, canManageUsers]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.roles.length === 0) {
      newErrors.roles = "At least one role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      setErrors({});
      setSuccessMessage("");

      const updateData: UpdateUserData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        roles: formData.roles,
        is_active: formData.is_active
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const result = await updateUser(userId, updateData);

      if (result.success) {
        setSuccessMessage("User updated successfully!");
        
        if (result.user) {
          setUser(result.user);
        }
        
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));
        
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ general: result.error || "Failed to update user" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors({ general: "Network error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handleRoleToggle = (roleName: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(role => role !== roleName)
        : [...prev.roles, roleName]
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to edit users.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white shadow-sm border-b">
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
                  <h1 className="text-xl font-bold text-gray-900">NETI Admin Panel</h1>
                  <p className="text-sm text-gray-600">NYK-Fil Maritime E-Training, Inc.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                  <p className="text-xs text-gray-500">{admin?.roles?.join(", ") || admin?.role || "User"}</p>
                </div>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserIcon className="w-8 h-8 text-blue-600" />
              Edit User
            </h1>
            <p className="mt-2 text-gray-600">Update user information and permissions</p>
          </motion.div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="ml-auto text-green-600 hover:text-green-700">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{errors.general}</span>
              <button onClick={() => setErrors(prev => ({ ...prev, general: undefined }))} className="ml-auto text-red-600 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border"
          >
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Leave blank to keep current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Confirm new password"
                        disabled={!formData.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={!formData.password}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Roles *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(ROLE_LABELS).map((roleKey) => (
                      <div
                        key={roleKey}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.roles.includes(roleKey)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleRoleToggle(roleKey)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.roles.includes(roleKey)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.roles.includes(roleKey) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {ROLE_LABELS[roleKey as keyof typeof ROLE_LABELS]}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {roleKey === 'super_admin' && 'Full system access'}
                              {roleKey === 'user_management' && 'Manage users and permissions'}
                              {roleKey === 'events' && 'Create and manage events'}
                              {roleKey === 'news' && 'Create and manage news articles'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.roles && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.roles}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('is_active', true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.is_active
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('is_active', false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        !formData.is_active
                          ? 'bg-red-100 text-red-800 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <UserX className="w-4 h-4" />
                      Inactive
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/users')}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white rounded-xl shadow-sm border p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current User Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">User ID:</span>
                  <span className="ml-2 font-medium">{user.id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="ml-2 font-medium">{new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Login:</span>
                  <span className="ml-2 font-medium">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}