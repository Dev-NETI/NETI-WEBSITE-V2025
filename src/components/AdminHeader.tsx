"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Shield,
  ChevronDown,
  Calendar,
  Home,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AdminHeader() {
  const { admin, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                NETI Admin Panel
              </h1>
              <p className="text-sm text-slate-500">
                NYK-Fil Maritime E-Training, Inc.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Visit Site</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-700" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800">
                  {admin?.name || "Admin User"}
                </p>
                <p className="text-xs text-slate-500">{admin?.email}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />

                  {/* Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {admin?.name || "Admin User"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {admin?.email}
                          </p>
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            {admin?.role === "admin" ? "Administrator" : admin?.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/admin/events"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Manage Events
                      </Link>

                      <Link
                        href="/"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Home className="w-4 h-4 text-slate-400" />
                        Visit Main Site
                      </Link>

                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className="w-4 h-4" />
                          {loggingOut ? (
                            <span className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-3 h-3 border border-red-600 border-t-transparent rounded-full"
                              />
                              Signing Out...
                            </span>
                          ) : (
                            "Sign Out"
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}