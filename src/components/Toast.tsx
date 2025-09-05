"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { useEffect } from "react";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-blue-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>{title}</p>
          {message && (
            <p
              className={`mt-1 text-sm ${getTextColor()}`}
              style={{ opacity: 0.8 }}
            >
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className={`ml-4 flex-shrink-0 rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            type === "success"
              ? "focus:ring-green-500"
              : type === "error"
              ? "focus:ring-red-500"
              : "focus:ring-blue-500"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
