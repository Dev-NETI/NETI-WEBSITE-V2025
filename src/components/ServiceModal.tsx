"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  CheckCircle,
  X,
} from "lucide-react";
import { useServiceModal } from "@/contexts/ServiceModalContext";

export default function ServiceModal() {
  const { selectedService, closeModal } = useServiceModal();
  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 50
    },
  };

  if (!selectedService) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="modal-overlay flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="modal-content bg-white rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl min-h-[50vh] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl mx-1 sm:mx-4 my-2 sm:my-4"
        >
          {/* Mobile Handle */}
          <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-2"></div>
          
          {/* Header */}
          <div
            className={`relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br ${selectedService.bgGradient} rounded-t-2xl sm:rounded-t-3xl`}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center`}
              >
                <selectedService.icon
                  className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${selectedService.color}`}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {selectedService.title}
                </h2>
                <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
                  {selectedService.shortDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Description */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Program Overview
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                {selectedService.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                What You&apos;ll Learn
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                {selectedService.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Enroll Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}