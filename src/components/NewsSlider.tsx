"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Clock,
  ArrowUpRight,
  Eye,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { NewsArticle } from "@/lib/news-db";

interface NewsSliderProps {
  news: NewsArticle[];
}

export default function NewsSlider({ news }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = React.useRef<NodeJS.Timeout | null>(null);

  // Calculate how many items to show and step by
  const itemsPerView = 3; // Show 3 tiles at once
  const maxIndex = Math.max(0, news.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && news.length > itemsPerView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= maxIndex) {
            return 0; // Reset to beginning when reaching the end
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, news.length, maxIndex, itemsPerView]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleTileClick = () => {
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  };

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 text-lg">No news articles available</p>
      </div>
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
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg">
              <Calendar className="w-4 h-4" />
              Latest News
            </span>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Maritime News &
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {" "}
              Updates
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Stay informed with the latest developments and insights from the
            maritime industry
          </motion.p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {news.length > itemsPerView && (
            <>
              <motion.button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-blue-600 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-blue-600 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* Tiles Container */}
          <div
            className="overflow-hidden px-12"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <motion.div
              className="flex transition-transform duration-700 ease-in-out gap-6"
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
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-200 cursor-pointer group"
                  onClick={handleTileClick}
                  style={{ minWidth: "320px" }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.div
                      variants={imageVariants}
                      whileHover="hover"
                      className="w-full h-full"
                    >
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </motion.div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <motion.span
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        {article.category}
                      </motion.span>
                    </div>

                    {/* Featured Badge */}
                    {article.featured && (
                      <div className="absolute top-4 right-4">
                        <motion.span
                          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Tag className="w-3 h-3" />
                          Featured
                        </motion.span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Read More Button (appears on hover) */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        className="w-full bg-white text-slate-900 py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Read Article
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(article.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    {/* Views and Tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Eye className="w-3 h-3" />
                        <span>{article.views.toLocaleString()} views</span>
                      </div>

                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {article.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="text-xs text-slate-500">
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {news.length > itemsPerView && (
            <motion.div
              className="flex items-center justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-blue-600 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}

          {/* Auto-play Indicator */}
          {news.length > itemsPerView && (
            <motion.div
              className="flex items-center justify-center gap-3 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isAutoPlaying ? "bg-green-500" : "bg-slate-400"
                } transition-colors duration-300`}
              />
              <span className="text-slate-600 text-sm">
                {isAutoPlaying ? "Auto-playing" : "Paused"}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
