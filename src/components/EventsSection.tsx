"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import type { Event } from "@/lib/database";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
    },
  },
} as const;

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
    },
  },
} as const;

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        // First authenticate with admin credentials
        const loginResponse = await axios.post(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
          }/api/admin/login`,
          {
            email: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("EventsSection: Login response:", loginResponse.data);

        // Get the token from login response
        const token =
          loginResponse.data.token || loginResponse.data.access_token;

        if (!token) {
          throw new Error("No token received from login");
        }

        // Now fetch events with the token
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
          }/api/admin/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        console.log(
          "EventsSection: API response:",
          response.status,
          response.status === 200
        );
        console.log("EventsSection: API result:", response.data);

        // Handle different response structures from Laravel backend
        const eventsData =
          response.data.data || response.data.events || response.data;

        if (eventsData && Array.isArray(eventsData)) {
          console.log("EventsSection: Fetched events:", eventsData);
          console.log("EventsSection: Events array length:", eventsData.length);

          // Filter to show registration-open or upcoming events and sort by date (earliest first)
          const openOrUpcoming = eventsData.filter(
            (event: Event) =>
              event.status === "registration-open" ||
              event.status === "upcoming"
          );
          const sortedEvents = openOrUpcoming.sort(
            (a: Event, b: Event) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          console.log(
            "EventsSection: Showing open/upcoming events:",
            sortedEvents.length
          );
          setEvents(sortedEvents);
        } else {
          console.log(
            "EventsSection: No valid events data found:",
            response.data
          );
        }
      } catch (error: unknown) {
        console.error("EventsSection: Error fetching events:", error);

        // If it's an auth error, you might want to redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Handle unauthorized access
          console.log("Unauthorized access - redirecting to login");
          // router.push('/login'); // if using Next.js router
        }
      } finally {
        console.log("EventsSection: Setting loading to false");
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section id="events" className="relative py-32 overflow-hidden">
      {/* Background with enhanced gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
      ></motion.div>
      <motion.div
        animate={{
          y: [10, -15, 10],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"
      ></motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-6 py-3 rounded-full font-semibold text-sm shadow-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Upcoming Maritime Events
              <Star className="w-4 h-4 text-yellow-500" />
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-8"
          >
            Featured Events
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Join us for upcoming maritime training events, workshops, and
            conferences designed to enhance your professional development and
            industry expertise.
          </motion.p>
        </motion.div>

        {/* Events Grid */}
        {eventsLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Primary Event Skeleton */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-slate-200/50 h-[400px]"
            >
              <div className="animate-pulse">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"></div>

                {/* Header skeleton */}
                <div className="h-24 bg-gradient-to-br from-slate-200 via-blue-100 to-slate-200 border-b border-slate-200">
                  <div className="p-6 flex justify-between items-start">
                    <div className="w-20 h-6 bg-blue-200 rounded-full"></div>
                    <div className="w-24 h-6 bg-green-200 rounded-full"></div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-blue-200 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/5"></div>
                  </div>
                  <div className="h-12 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-xl w-full mt-6"></div>
                </div>
              </div>
            </motion.div>

            {/* Secondary Events Skeletons */}
            <div className="lg:col-span-1 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:flex lg:flex-col lg:space-y-6">
              {[...Array(2)].map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: (index + 1) * 0.1 }}
                  className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-slate-200/50 h-56"
                >
                  <div className="animate-pulse">
                    {/* Header skeleton */}
                    <div className="h-16 bg-gradient-to-br from-slate-200 via-blue-100 to-slate-200 border-b border-slate-200">
                      <div className="p-4 flex justify-between items-center">
                        <div className="w-16 h-4 bg-blue-200 rounded-full"></div>
                        <div className="w-12 h-4 bg-green-200 rounded-full"></div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                      <div className="space-y-2 mt-4">
                        <div className="h-3 bg-blue-200 rounded w-4/5"></div>
                        <div className="h-3 bg-slate-200 rounded w-3/5"></div>
                      </div>
                      <div className="h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-full mt-3"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <Calendar className="w-12 h-12 text-blue-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                No Upcoming Events
              </h3>
              <p className="text-lg text-slate-600 mb-2">
                We&apos;re currently planning exciting new maritime training
                events.
              </p>
              <p className="text-slate-500">
                Check back soon for updates on workshops, conferences, and
                training sessions.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Primary Event - Takes up 2 columns */}
            {(() => {
              console.log(
                "EventsSection: Total events available:",
                events.length
              );
              console.log(
                "EventsSection: Events data:",
                events.map((e) => ({ title: e.title, date: e.date, id: e.id }))
              );
              return events.slice(0, 1);
            })().map((event) => {
              const isSpecialEvent = event.title
                .toLowerCase()
                .includes("anniversary");

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="lg:col-span-2 group relative"
                >
                  <motion.div
                    variants={cardHoverVariants}
                    className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 hover:border-blue-300/50 transition-all duration-700 ${
                      isSpecialEvent ? "ring-2 ring-yellow-400/50" : ""
                    }`}
                  >
                    {/* Header Section with Badges */}
                    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100/50">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg"
                          >
                            {event.category}
                          </motion.span>

                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                              event.status === "registration-open"
                                ? "bg-green-500 text-white"
                                : event.status === "upcoming"
                                ? "bg-yellow-500 text-white"
                                : event.status === "completed"
                                ? "bg-blue-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {event.status === "registration-open"
                              ? "Registration Open"
                              : event.status === "upcoming"
                              ? "Upcoming"
                              : event.status === "completed"
                              ? "Completed"
                              : "Cancelled"}
                          </motion.span>
                        </div>

                        {/* Decorative icon */}
                        <motion.div
                          animate={{
                            rotate: [0, 5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg"
                        >
                          <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 relative">
                      {/* Decorative element */}
                      <div className="absolute top-0 left-8 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>

                      <div className="pt-4">
                        <motion.h3
                          className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          {event.title}
                        </motion.h3>

                        <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-4 mb-8">
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 text-slate-600 group/item"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover/item:bg-blue-200 transition-colors">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                              <p className="text-sm text-slate-500">Date</p>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 text-slate-600 group/item"
                          >
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover/item:bg-green-200 transition-colors">
                              <MapPin className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {event.location}
                              </p>
                              <p className="text-sm text-slate-500">
                                Training Venue
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 text-slate-600 group/item"
                          >
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover/item:bg-purple-200 transition-colors">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                Capacity: {event.currentRegistrations ?? 0}
                                {event.maxCapacity
                                  ? ` / ${event.maxCapacity}`
                                  : ""}
                              </p>
                              <p className="text-sm text-slate-500">
                                Registrations
                              </p>
                            </div>
                          </motion.div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl ${
                            event.status === "registration-open"
                              ? "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white hover:from-green-600 hover:via-green-700 hover:to-emerald-700"
                              : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800"
                          }`}
                        >
                          {event.status === "registration-open"
                            ? "Register Now"
                            : "Learn More"}
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Decorative corner element */}
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-100/50 to-transparent rounded-tl-full"></div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Secondary Events - Smaller cards on the right */}
            <div className="lg:col-span-1 space-y-6 md:grid md:grid-cols-2 md:gap-2 md:space-y-0 lg:flex lg:flex-col lg:space-y-2 lg:h-64">
              {events.slice(1, 3).map((event) => {
                const isSpecialEvent = event.title
                  .toLowerCase()
                  .includes("anniversary");

                return (
                  <div key={event.id} className="group relative lg:flex-1">
                    <div
                      className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-slate-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-xl h-full flex flex-col ${
                        isSpecialEvent ? "ring-1 ring-yellow-400/50" : ""
                      }`}
                    >
                      {/* Special event indicator for small cards */}
                      {isSpecialEvent && (
                        <div className="absolute top-2 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-bold z-20 rounded-l-lg">
                          SPECIAL
                        </div>
                      )}

                      {/* Compact Header Section */}
                      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-100">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-sm">
                              {event.category}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                event.status === "registration-open"
                                  ? "bg-green-500 text-white"
                                  : event.status === "upcoming"
                                  ? "bg-yellow-500 text-white"
                                  : event.status === "completed"
                                  ? "bg-blue-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {event.status === "registration-open"
                                ? "Registration Open"
                                : event.status === "upcoming"
                                ? "Upcoming"
                                : event.status === "completed"
                                ? "Completed"
                                : "Cancelled"}
                            </span>
                          </div>

                          {/* Decorative icon */}
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Compact Content Section */}
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                          {event.title}
                        </h4>

                        <p className="text-slate-600 mb-3 text-sm leading-relaxed line-clamp-2">
                          {event.description}
                        </p>

                        {/* Compact Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            <span className="font-medium">
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <MapPin className="w-3 h-3 text-green-600" />
                            <span className="truncate">{event.location}</span>
                          </div>

                          {/* Removed featured label: not in Event interface */}
                        </div>

                        {/* Compact Action Button */}
                        <button
                          className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 ${
                            event.status === "registration-open"
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                          }`}
                        >
                          {event.status === "registration-open"
                            ? "Register"
                            : "Learn More"}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* View All Events Button */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <div className="relative inline-block">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl"></div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  href="/events"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-slate-700/50 hover:border-slate-600/50 group"
                >
                  <span className="relative">
                    View All Maritime Events
                    <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                  </span>

                  <motion.div
                    whileHover={{ x: 5, rotate: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Additional info */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-slate-600 mt-6 text-lg"
            >
              Discover more training opportunities and professional development
              events
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
