"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Anchor,
  Waves,
  Ship,
} from "lucide-react";
import Image from "next/image";
import { loginToLaravel, verifyLaravelToken } from "@/lib/laravel-auth";

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await verifyLaravelToken();

        if (result.success) {
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const result = await loginToLaravel(formData.email, formData.password);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Maritime Background with Ocean Waves */}
      <div className="absolute inset-0">
        {/* Ocean gradient background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/60 via-cyan-800/40 to-teal-700/60" />

        {/* Animated wave patterns */}
        <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-[200%] h-24 bg-gradient-to-r from-cyan-500/20 via-blue-400/30 to-teal-400/20"
            style={{
              clipPath:
                "polygon(0% 100%, 100% 100%, 100% 0%, 90% 10%, 80% 0%, 70% 15%, 60% 5%, 50% 20%, 40% 0%, 30% 25%, 20% 10%, 10% 30%, 0% 15%)",
            }}
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[200%] h-16 bg-gradient-to-r from-blue-400/15 via-cyan-300/25 to-blue-500/15"
            style={{
              clipPath:
                "polygon(0% 100%, 100% 100%, 100% 20%, 85% 0%, 75% 30%, 65% 10%, 55% 40%, 45% 20%, 35% 50%, 25% 30%, 15% 60%, 5% 40%, 0% 70%)",
            }}
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Floating maritime elements */}
        <motion.div
          className="absolute top-20 left-16 text-cyan-300/20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Anchor className="w-8 h-8" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-20 text-blue-300/15"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Ship className="w-10 h-10" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/4 text-teal-300/20"
          animate={{
            x: [0, 10, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Waves className="w-6 h-6" />
        </motion.div>

        {/* Deep sea lighting effects */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl shadow-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400/15 rounded-full blur-3xl shadow-2xl" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl shadow-xl" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Glassmorphism container with maritime theme - Brightened */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-cyan-300/30 overflow-hidden relative">
          {/* Enhanced maritime card effects - Lighter */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 via-blue-50/70 to-teal-50/60 rounded-3xl -z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-200/20 to-transparent rounded-3xl" />

          {/* Header with NETI Logo - Lighter Theme */}
          <div className="bg-gradient-to-r from-cyan-100 via-blue-50 to-teal-50 p-8 text-center relative overflow-hidden border-b border-cyan-200/30">
            {/* Light maritime header background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-cyan-50/60" />

            {/* Subtle wave decoration - bottom only */}
            <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 Q25,0 50,10 T100,10 V20 H0 Z' fill='%2306b6d4' fillOpacity='0.1'/%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              {/* Enhanced logo container with light maritime styling */}
              <motion.div
                className="bg-white/70 p-5 rounded-2xl backdrop-blur-sm shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-cyan-50/30 rounded-2xl" />
                <motion.div
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <Image
                    src="/assets/images/NETI.svg"
                    alt="NETI Logo"
                    width={120}
                    height={80}
                    className="w-60 h-20 drop-shadow-md"
                  />
                </motion.div>
              </motion.div>

              {/* Enhanced title section with lighter theme and adjusted fonts */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  className="flex items-center justify-center gap-3 mb-3"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Anchor className="w-5 h-5 text-cyan-600" />
                  <h1 className="text-3xl font-extrabold text-slate-800 drop-shadow-sm tracking-tight">
                    Admin Portal
                  </h1>
                  <Anchor className="w-5 h-5 text-cyan-600 scale-x-[-1]" />
                </motion.div>
                <motion.p
                  className="text-slate-600 drop-shadow-sm text-base font-semibold"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  NYK-Fil Maritime E-Training, Inc.
                </motion.p>
                <div className="mt-3 flex justify-center">
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced form section with lighter maritime glass effect */}
          <div className="p-8 relative">
            {/* Brightened maritime form background */}
            <div className="absolute inset-4 bg-gradient-to-br from-slate-50/60 via-blue-50/50 to-cyan-50/60 rounded-xl -z-10 backdrop-blur-sm" />
            <div className="absolute inset-4 border border-cyan-200/20 rounded-xl -z-10" />
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-300/30 rounded-xl text-emerald-100 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="drop-shadow-sm">
                    Login successful! Redirecting...
                  </span>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl text-red-100 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-300" />
                <span className="drop-shadow-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced Email Field with maritime theme */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-slate-800 mb-2 tracking-wide"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-cyan-600 group-focus-within:text-cyan-700 transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/70 
                             text-slate-800 placeholder-slate-500 transition-all duration-300 
                             shadow-lg hover:shadow-xl focus:shadow-2xl hover:bg-white/80"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </motion.div>

              {/* Enhanced Password Field with maritime theme */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-slate-800 mb-2 tracking-wide"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-cyan-600 group-focus-within:text-cyan-700 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/70 
                             text-slate-800 placeholder-slate-500 transition-all duration-300 
                             shadow-lg hover:shadow-xl focus:shadow-2xl hover:bg-white/80"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </motion.div>

              {/* Enhanced Maritime Login Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl relative overflow-hidden tracking-wide ${
                  loading || success
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 via-blue-700 to-teal-600 hover:from-cyan-700 hover:via-blue-800 hover:to-teal-700 transform hover:scale-105"
                }`}
                whileHover={
                  !loading && !success
                    ? {
                        boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)",
                      }
                    : {}
                }
                whileTap={!loading && !success ? { scale: 0.98 } : {}}
              >
                {/* Button wave effect overlay */}
                {!loading && !success && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                )}

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
                    <span className="relative z-10">Navigating to Port...</span>
                  </>
                ) : success ? (
                  <>
                    <motion.div
                      className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                    <span className="relative z-10">Welcome Aboard!</span>
                  </>
                ) : (
                  <>
                    <Ship className="w-5 h-5" />
                    <span className="relative z-10">Set Sail</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center text-sm text-slate-500"
            >
              <p>Default credentials:</p>
              <p className="font-mono bg-slate-100 px-3 py-2 rounded-lg mt-2">
                <strong>Email:</strong> admin@neti.com.ph
                <br />
                <strong>Password:</strong> admin123
              </p>
            </motion.div> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
