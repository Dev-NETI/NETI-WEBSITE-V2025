"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../public/assets/images/neti1.svg";
import Title from "../../public/assets/images/flag.svg";

import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading on initial render
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading animation when pathname changes
    setIsLoading(true);
    setIsVisible(false);

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 5000); // 2 seconds animation

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Initial load with loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-950 flex items-center justify-center p-4 sm:p-6 lg:p-8"
          >
            {/* Main Logo Container */}
            <div className="relative z-50 flex flex-col items-center justify-center gap-2 sm:gap-4 lg:gap-6 max-w-full">
              <Logo className="logo-title" />
              <Title className="loading" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
