"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Eye } from "lucide-react";
import Image from "next/image";
import { NewsArticle } from "@/lib/news-db";

interface NewsSliderProps {
  news?: NewsArticle[];
}

export default function NewsSlider({ news }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = React.useRef<NodeJS.Timeout | null>(null);

  // Calculate how many items to show and step by
  const itemsPerView = 3; // Show 3 tiles at once
  const totalItems = news?.length || 0;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  // Auto-play functionality with rotational behavior
  useEffect(() => {
    if (isAutoPlaying && totalItems > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex > maxIndex ? 0 : nextIndex; // Rotate back to start
        });
      }, 5000); // 5 seconds for better UX
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, totalItems, maxIndex, itemsPerView]);

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? maxIndex : newIndex; // Rotate to end if at start
    });

    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, maxIndex]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex > maxIndex ? 0 : newIndex; // Rotate to start if at end
    });

    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, maxIndex]);

  const handleTileClick = useCallback(() => {
    setIsAutoPlaying(false);
    // Resume auto-play after 8 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);
  }, []);

  const handlePauseToggle = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      } else if (event.key === " ") {
        event.preventDefault();
        handlePauseToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext, handlePauseToggle]);

  // Early return if no news data - AFTER all hooks
  if (!news || !Array.isArray(news) || news.length === 0) {
    return (
      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/5 to-indigo-300/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            {/* Icon */}
            <motion.div
              className="mx-auto w-24 h-24 mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                type: "spring",
                stiffness: 300,
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Eye className="w-12 h-12 text-slate-400" />
              </motion.div>
            </motion.div>

            {/* Main Message */}
            <motion.h3
              className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              No News Available
            </motion.h3>

            <motion.p
              className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              We&apos;re currently working on bringing you the latest maritime
              industry news and updates. Check back soon!
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full text-blue-700 text-sm font-medium shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Stay tuned for updates
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const tileVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
    hover: {
      y: -8,
      scale: 1.03,
      transition: {
        duration: 0.3,
      },
    },
  } as const;

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.6,
      },
    },
  } as const;

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/5 to-indigo-300/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            News &
            <span className="relative inline-block ml-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Updates
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h2>

          {/* Auto-slide indicator */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-3 text-slate-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50">
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isAutoPlaying ? "bg-green-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span className="text-sm font-medium">
                {isAutoPlaying ? "Auto-playing" : "Paused"} • 5s intervals
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {news.length > itemsPerView && (
            <>
              <motion.button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 group bg-white/95 backdrop-blur-md hover:bg-white text-slate-600 hover:text-blue-600 p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border border-white/50 disabled:opacity-30 disabled:cursor-not-allowed"
                whileHover={{ x: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
              >
                <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 group bg-white/95 backdrop-blur-md hover:bg-white text-slate-600 hover:text-blue-600 p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border border-white/50 disabled:opacity-30 disabled:cursor-not-allowed"
                whileHover={{ x: 3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
              >
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </>
          )}

          {/* Tiles Container */}
          <div
            className="overflow-hidden px-16 relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Loading overlay during transitions */}
            {isTransitioning && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white/30 to-blue-50/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 border-3 border-blue-200 rounded-full" />
                  <motion.div
                    className="absolute inset-0 w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                  </div>
                </motion.div>
              </div>
            )}
            <motion.div
              className={`flex gap-6 transition-transform duration-700 ease-in-out ${
                isTransitioning ? "pointer-events-none" : ""
              }`}
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView + 2)
                }%)`,
              }}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {news.map((article) => (
                <motion.article
                  key={article.id}
                  variants={tileVariants}
                  whileHover="hover"
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 hover:border-blue-300/50 cursor-pointer group relative"
                  onClick={handleTileClick}
                  style={{ minWidth: "320px" }}
                >
                  {/* Featured Badge */}
                  {article.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.div
                      variants={imageVariants}
                      whileHover="hover"
                      className="w-full h-full"
                    >
                      {article.image_url ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE}/news_images/${article.image}`}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:brightness-110 transition-all duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <Eye className="w-6 h-6 text-slate-500" />
                            </div>
                            <span className="text-slate-500 text-sm font-medium">
                              No Image Available
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/40
                     via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                    />

                    {/* Read More Button (appears on hover) */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <motion.button
                        className="w-full bg-white/95 backdrop-blur-md text-slate-900 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Read Full Article
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {article.title || "Untitled Article"}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt ||
                        "No description available for this article."}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {news.length > itemsPerView && (
            <motion.div
              className="flex items-center justify-center gap-3 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 300 }}
            >
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? "bg-blue-600 w-12 h-3"
                      : "bg-slate-300 hover:bg-slate-400 w-3 h-3"
                  }`}
                  whileHover={{
                    scale: index === currentIndex ? 1.1 : 1.3,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-800"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Controls */}
          {news.length > itemsPerView && (
            <motion.div
              className="flex items-center justify-center gap-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, type: "spring", stiffness: 300 }}
            >
              {/* Pause/Play Button */}
              <motion.button
                onClick={handlePauseToggle}
                className="group flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-blue-600 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl border border-white/50 hover:border-blue-200/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      isAutoPlaying
                        ? "bg-green-500 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                  {isAutoPlaying && (
                    <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
                </div>
                <span className="text-sm font-semibold transition-colors duration-300">
                  {isAutoPlaying ? "Auto-playing" : "Paused"}
                </span>
                <div className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
                  {isAutoPlaying ? "Click to pause" : "Click to resume"}
                </div>
              </motion.button>

              {/* Progress Indicator */}
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-500 font-medium">
                  Progress
                </div>
                <div className="relative w-24 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-full shadow-sm"
                    initial={{ width: "0%" }}
                    animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                    transition={{
                      duration: 5,
                      ease: "linear",
                      repeat: isAutoPlaying ? Infinity : 0,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-indigo-400/50 rounded-full"
                    animate={{
                      opacity: isAutoPlaying ? [0.3, 0.7, 0.3] : 0.3,
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: isAutoPlaying ? Infinity : 0,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
