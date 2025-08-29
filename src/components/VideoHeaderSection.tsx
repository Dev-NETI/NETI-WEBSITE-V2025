"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  User,
  Clock,
  ChevronRight,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/lib/database";

interface ApiResponse {
  success: boolean;
  data: Event[];
  count: number;
}

export default function VideoHeaderSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Client-side check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch events from API
  useEffect(() => {
    if (!isClient) return;

    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        console.log("VideoHeaderSection: Starting to fetch events...");
        const response = await fetch("/api/events?limit=4");
        const result: ApiResponse = await response.json();

        console.log(
          "VideoHeaderSection: API response:",
          response.status,
          response.ok
        );
        console.log("VideoHeaderSection: API result:", result);

        if (result.success) {
          console.log("VideoHeaderSection: Fetched events:", result.data);
          console.log(
            "VideoHeaderSection: Events array length:",
            result.data?.length || 0
          );
          console.log("VideoHeaderSection: Setting events state...");
          setEvents(result.data);
        } else {
          console.log("VideoHeaderSection: API error:", result);
        }
      } catch (error) {
        console.error("VideoHeaderSection: Error fetching events:", error);
      } finally {
        console.log("VideoHeaderSection: Setting loading to false");
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, [isClient]);

  const articles = [
    {
      id: 1,
      category: "Maritime Training",
      title:
        "Advanced Bridge Simulation Technology Enhances Maritime Safety Standards",
      excerpt:
        "NETI introduces state-of-the-art bridge simulation technology that provides realistic training scenarios for maritime professionals, significantly improving safety protocols and operational efficiency.",
      image: "/assets/images/nttc.jpg",
      author: "Captain Maria Santos",
      date: "December 15, 2024",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      category: "Industry News",
      title:
        "NETI Partners with Leading Maritime Companies for Enhanced Training Programs",
      excerpt:
        "Strategic partnerships with major shipping lines enable NETI to provide industry-specific training programs that meet the evolving needs of the maritime sector.",
      image: "/assets/images/nyk.png",
      author: "John Rodriguez",
      date: "December 12, 2024",
      readTime: "3 min read",
      featured: false,
    },
    {
      id: 3,
      category: "Technology",
      title: "Digital Learning Platform Revolutionizes Maritime Education",
      excerpt:
        "Our new e-learning platform combines virtual reality, interactive simulations, and real-time assessments to create an immersive learning experience for maritime professionals.",
      image: "/assets/images/tdg.png",
      author: "Dr. Sarah Chen",
      date: "December 10, 2024",
      readTime: "4 min read",
      featured: false,
    },
    {
      id: 4,
      category: "Certification",
      title:
        "New ISO Certification Strengthens NETI's Training Quality Assurance",
      excerpt:
        "Achievement of additional ISO certifications demonstrates NETI's commitment to maintaining the highest standards in maritime training and education services.",
      image: "/assets/images/nttc.jpg",
      author: "Michael Thompson",
      date: "December 8, 2024",
      readTime: "3 min read",
      featured: false,
    },
  ];

  // Static events removed - now using only database events

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative bg-white">
      {/* Professional Video Header Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/assets/images/drone_shot1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Professional Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/60 to-slate-800/70" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              {/* Main Heading */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 relative"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  backgroundPosition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  background: `linear-gradient(45deg, #ffffff, #e0f2fe, #ffffff, #3b82f6, #ffffff, #60a5fa, #ffffff)`,
                  backgroundSize: "300% 300%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter:
                    "drop-shadow(0 0 25px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
                }}
              >
                Welcome to NYK-Fil Maritime E-Training, Inc.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl"
              >
                Discover the latest innovations and achievements in maritime
                education. Stay informed with our comprehensive coverage of
                industry developments and training excellence.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  href="#articles"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Explore Latest News
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Professional Articles Section */}
      <section
        id="articles"
        className="py-24 bg-gradient-to-br from-white to-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                <Calendar className="w-4 h-4" />
                News & Insights
              </span>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
            >
              Latest Maritime News
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Stay updated with the latest developments, innovations, and
              insights from the maritime training industry
            </motion.p>
          </motion.div>

          {/* Articles Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Featured Article - Large */}
            <motion.article
              variants={itemVariants}
              className="lg:row-span-2 group"
            >
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-blue-200">
                <div className="relative h-80 lg:h-96 overflow-hidden">
                  <Image
                    src={articles[0].image}
                    alt={articles[0].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {articles[0].category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {articles[0].title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                    {articles[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {articles[0].author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {articles[0].date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {articles[0].readTime}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Regular Articles - Smaller */}
            <div className="space-y-8">
              {articles.slice(1).map((article) => (
                <motion.article
                  key={article.id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-200">
                    <div className="flex">
                      <div className="relative w-40 h-32 flex-shrink-0 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-slate-800 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-slate-600 text-sm mb-3 leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* View More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-slate-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Articles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section
        id="events"
        className="py-24 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                <Calendar className="w-4 h-4" />
                Upcoming Events
              </span>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
            >
              Events
            </motion.h2>
            {/* <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Join us for upcoming maritime training events, workshops, and
              conferences designed to enhance your professional development
            </motion.p> */}
          </motion.div>

          {/* Events Grid */}
          {eventsLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200 h-96"
                >
                  <div className="animate-pulse">
                    <div className="h-48 bg-slate-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-slate-600 text-lg">
                No upcoming events at this time.
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Check back soon for new maritime training events.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {(() => {
                console.log("VideoHeaderSection: About to render events, events array:", events);
                console.log("VideoHeaderSection: Events length:", events.length);
                return events.slice(0, 4).map((event, index) => {
                  console.log(
                    `VideoHeaderSection: Rendering event ${index + 1}:`,
                    event.title,
                    event.status
                  );
                  return (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    className="group"
                  >
                    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-blue-200 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              event.status === "registration-open"
                                ? "bg-green-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {event.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              event.status === "registration-open"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {event.status === "registration-open"
                              ? "Registration Open"
                              : "Upcoming"}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      <div className="p-6 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                          {event.description}
                        </p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{event.time}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{event.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>{event.attendees} Expected Attendees</span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                            event.status === "registration-open"
                              ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                          }`}
                        >
                          {event.status === "registration-open"
                            ? "Register Now"
                            : "Learn More"}
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
                });
              })()}
            </motion.div>
          )}

          {/* View All Events Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-slate-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
