"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Mail,
  User,
  Lock,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { CreateUserData, Role } from "@/lib/laravel-user";
import { createUser, getRoles } from "@/lib/laravel-user";
import Image from "next/image";

// Removed hardcoded roles - will fetch from API

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}

export default function CreateUserPage() {
  const router = useRouter();
  const { canManageUsers, isSuperAdmin } = usePermissions();
  const { admin } = useAuth();

  const [formData, setFormData] = useState<CreateUserFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Fetch available roles on component mount
  useEffect(() => {
    const fetchAvailableRoles = async () => {
      try {
        const result = await getRoles();
        if (result.success && result.roles) {
          setAvailableRoles(result.roles);
        } else {
          setError("Failed to fetch available roles");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch available roles");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchAvailableRoles();
  }, []);

  // Helper function to get role by name
  const getRoleByName = (roleName: string): Role | undefined => {
    return availableRoles.find((role) => role.name === roleName);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation - required, string, max 255 chars (matching backend)
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length > 255) {
      errors.name = "Name must not exceed 255 characters";
    }

    // Email validation - required, email format, max 255 chars, unique (backend will check unique)
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    } else if (formData.email.trim().length > 255) {
      errors.email = "Email must not exceed 255 characters";
    }

    // Password validation - required, min 6 chars (matching backend)
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Roles validation - required array with min 1 item, each role must exist (backend will validate exists)
    if (!formData.roles || formData.roles.length === 0) {
      errors.roles = "At least one role is required";
    } else {
      // Validate that selected roles exist in available roles
      const invalidRoles = formData.roles.filter(
        (roleName) => !availableRoles.find((role) => role.name === roleName)
      );
      if (invalidRoles.length > 0) {
        errors.roles = "Selected role is not available";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear general error
    if (error) setError("");
  };

  const handleRoleChange = (roleName: string, isChecked: boolean) => {
    setFormData((prev) => {
      const currentRoles = [...prev.roles];
      if (isChecked) {
        // Add role if not already present
        if (!currentRoles.includes(roleName)) {
          currentRoles.push(roleName);
        }
      } else {
        // Remove role
        const index = currentRoles.indexOf(roleName);
        if (index > -1) {
          currentRoles.splice(index, 1);
        }
      }
      return { ...prev, roles: currentRoles };
    });

    // Clear validation error for roles field
    if (validationErrors.roles) {
      setValidationErrors((prev) => ({ ...prev, roles: "" }));
    }

    // Clear general error
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData: CreateUserData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        roles: formData.roles,
      };

      const result = await createUser(userData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/users");
        }, 2000);
      } else {
        setError(result.error || "Failed to create user");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to create users.
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
                    {admin?.roles?.join(", ") || admin?.role || "User"}
                  </p>
                </div>

                <button
                  onClick={() => router.push("/admin/users")}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New User
                </h1>
                <p className="text-gray-600">Add a new user to the system</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md"
          >
            <div className="p-6">
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>User created successfully! Redirecting...</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {loadingRoles && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                  <span>Loading available roles...</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        validationErrors.name
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        validationErrors.email
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        validationErrors.password
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        validationErrors.confirmPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      User Roles (Select one or more)
                    </div>
                  </label>

                  {loadingRoles ? (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full mr-2"
                      />
                      Loading available roles...
                    </div>
                  ) : (
                    <div
                      className={`space-y-3 p-4 border rounded-lg ${
                        validationErrors.roles
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      {availableRoles.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No roles available
                        </p>
                      ) : (
                        availableRoles.map((role) => {
                          // Only super admins can assign other super admins
                          if (role.name === "super_admin" && !isSuperAdmin) {
                            return null;
                          }

                          const isChecked = formData.roles.includes(role.name);

                          return (
                            <motion.div
                              key={role.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`relative p-4 border rounded-lg transition-all cursor-pointer ${
                                isChecked
                                  ? "border-blue-300 bg-blue-50 shadow-sm"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                              }`}
                              onClick={() =>
                                handleRoleChange(role.name, !isChecked)
                              }
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  id={`role-${role.id}`}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleRoleChange(
                                      role.name,
                                      e.target.checked
                                    )
                                  }
                                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <div className="flex-1 min-w-0">
                                  <label
                                    htmlFor={`role-${role.id}`}
                                    className="cursor-pointer"
                                  >
                                    <div className="font-medium text-gray-900 mb-1">
                                      {role.display_name}
                                    </div>
                                    {role.description && (
                                      <div className="text-sm text-gray-600">
                                        {role.description}
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>

                              {isChecked && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                                >
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {validationErrors.roles && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.roles}
                    </p>
                  )}

                  {/* Selected Roles Summary */}
                  {formData.roles.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm font-medium text-blue-800 mb-2">
                        Selected Roles ({formData.roles.length}):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.roles.map((roleName) => {
                          const role = getRoleByName(roleName);
                          return (
                            <span
                              key={roleName}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200"
                            >
                              {role?.display_name || roleName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || success || loadingRoles}
                  whileHover={{
                    scale: loading || success || loadingRoles ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: loading || success || loadingRoles ? 1 : 0.98,
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading || success || loadingRoles
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Creating User...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      User Created!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create User
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
