"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Youtube, Instagram, X, Users2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function SocialMediaModal() {
  const [isVisible, setIsVisible] = useState(false);

  const socialMedia = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/NETICertified/",
      color: "#1877F2",
      description: "Follow us for updates and news",
    },
  ];

  useEffect(() => {
    const checkShouldShow = () => {
      const lastShown = localStorage.getItem("social-modal-last-shown");
      const now = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

      if (!lastShown) {
        // First visit - show after 3 seconds
        setTimeout(() => setIsVisible(true), 3000);
        return;
      }

      const timeDiff = now - parseInt(lastShown);
      if (timeDiff >= thirtyMinutes) {
        // Show again after 30 minutes
        setTimeout(() => setIsVisible(true), 3000);
      }
    };

    checkShouldShow();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(
      "social-modal-last-shown",
      new Date().getTime().toString()
    );
  };

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-2xl w-80 max-w-[calc(100vw-2rem)] sm:bottom-6 sm:right-6 sm:w-80 overflow-hidden pointer-events-auto"
            initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Users2 className="w-8 h-8" />
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Stay Connected
                </motion.h2>
                <motion.p
                  className="text-blue-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Follow NETI on social media for the latest updates
                </motion.p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {socialMedia.map((social, index) => (
                  <motion.button
                    key={social.id}
                    onClick={() => handleSocialClick(social.url)}
                    className="w-full group relative bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: social.color }}
                      >
                        <social.icon className="w-6 h-6" fill="currentColor" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                          {social.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {social.description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                className="mt-6 pt-6 border-t border-gray-200 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="text-sm text-gray-500">
                  This message appears every 30 minutes
                </p>
                <button
                  onClick={handleClose}
                  className="mt-3 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
