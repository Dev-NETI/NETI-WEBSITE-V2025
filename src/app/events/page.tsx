"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  Search,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Event } from "@/lib/database";

interface ApiResponse {
  success: boolean;
  data: Event[];
  count: number;
  error?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // First authenticate with admin credentials to get events
        const loginResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
          }/api/admin/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: "admin1@neti.com.ph",
              password: "admin123",
            }),
          }
        );

        const loginData = await loginResponse.json();
        const token = loginData.token || loginData.access_token;

        if (!token) {
          throw new Error("No token received from login");
        }

        // Now fetch events with the token
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
          }/api/admin/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();

        // Handle different response structures from Laravel backend
        const eventsData = result.data || result.events || result;

        if (eventsData && Array.isArray(eventsData)) {
          // Sort events by start date (earliest first)
          const sortedEvents = eventsData.sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
          setEvents(sortedEvents);
        } else {
          setError("Failed to fetch events - invalid data format");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(events.map((event) => event.category)));

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-blue-900 text-2xl flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
            />
            Loading Events...
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Events
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-20 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mt-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-slate-800 mb-6"
            >
              Events
            </motion.h1>
            {/* <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover upcoming maritime training events, workshops, and
              conferences. Enhance your professional development with
              industry-leading programs.
            </motion.p> */}
          </div>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <p className="text-lg text-gray-600">
              Found{" "}
              <span className="font-semibold text-blue-600">
                {filteredEvents.length}
              </span>{" "}
              events
            </p>
          </motion.div>

          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 mb-4">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No events found</h3>
                <p className="mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group h-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-300 h-full flex flex-col">
                    {/* Enhanced Header Section */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-blue-300 rounded-full"></div>
                        <div className="absolute bottom-6 right-6 w-12 h-12 bg-blue-200 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-indigo-200 rounded-full"></div>
                      </div>

                      {/* Center Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                        >
                          <Calendar className="w-12 h-12 text-blue-600" />
                        </motion.div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                        >
                          {event.category}
                        </motion.span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {event.status.charAt(0).toUpperCase() +
                            event.status.slice(1)}
                        </motion.span>
                      </div>

                      {/* Featured Badge */}
                      {event.featured && (
                        <div className="absolute bottom-4 left-4">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                          >
                            ⭐ Featured
                          </motion.span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title */}
                      <motion.h3
                        whileHover={{ x: 2 }}
                        className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]"
                      >
                        {event.title}
                      </motion.h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed text-sm line-clamp-3 flex-grow min-h-[4.5rem]">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-3 mb-6">
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-center gap-3 text-sm text-gray-600 group/item"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover/item:bg-blue-200 transition-colors">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {formatDate(event.startDate)}
                            </p>
                            <p className="text-xs text-gray-500">Start Date</p>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-center gap-3 text-sm text-gray-600 group/item"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover/item:bg-purple-200 transition-colors">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {event.startDate !== event.endDate
                                ? "Multi-Day Event"
                                : "Single Day Event"}
                            </p>
                            <p className="text-xs text-gray-500">Duration</p>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-center gap-3 text-sm text-gray-600 group/item"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/item:bg-green-200 transition-colors">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 line-clamp-1">
                              {event.location}
                            </p>
                            <p className="text-xs text-gray-500">Location</p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-4 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                          event.status === "active"
                            ? "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white hover:from-green-600 hover:via-green-700 hover:to-emerald-700"
                            : event.status === "inactive"
                            ? "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700"
                            : event.status === "completed"
                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-red-400 to-red-500 text-white cursor-not-allowed"
                        }`}
                        disabled={
                          event.status === "completed" ||
                          event.status === "cancelled"
                        }
                      >
                        {event.status === "active" ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Register Now
                            <motion.div
                              whileHover={{ x: 2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </>
                        ) : event.status === "inactive" ? (
                          <>
                            Learn More
                            <motion.div
                              whileHover={{ x: 2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </>
                        ) : event.status === "completed" ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Event Completed
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Event Cancelled
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
