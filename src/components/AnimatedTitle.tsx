"use client";

import { motion } from "framer-motion";

interface AnimatedTitleProps {
  text: string;
  className?: string;
  accent?: string;
}

export default function AnimatedTitle({
  text,
  className = "",
  accent = "#3b82f6",
}: AnimatedTitleProps) {
  return (
    <motion.h2
      className={`font-bold text-3xl md:text-4xl text-white relative ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        filter: [
          "drop-shadow(0 0 15px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))",
          "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))",
          "drop-shadow(0 0 15px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))",
        ],
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        backgroundPosition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
        filter: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      style={{
        background: `linear-gradient(45deg, #ffffff, #e0f2fe, #ffffff, ${accent}, #ffffff, #60a5fa, #ffffff)`,
        backgroundSize: "300% 300%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter:
          "drop-shadow(0 0 15px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))",
      }}
    >
      {text}
    </motion.h2>
  );
}
