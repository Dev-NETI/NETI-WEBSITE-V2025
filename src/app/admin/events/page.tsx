"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminHeader from "@/components/AdminHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { verifyLaravelToken } from "@/lib/laravel-auth";

interface FormData {
  title: string;
  category: string;
  content: string;
  description: string;
  featured: boolean;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    content: "",
    description: "",
    featured: false,
    location: "",
    startDate: "",
    endDate: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await verifyLaravelToken();
        console.log(result);
        if (result.success && result.token) {
          setAuthenticated(true);
          setToken(result.token);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch events from API
  const fetchEvents = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/events", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const eventsData = data.data || data.events || data;

      if (eventsData && Array.isArray(eventsData)) {
        setEvents(eventsData);
      } else {
        setError("Failed to fetch events - invalid data format");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when authenticated
  useEffect(() => {
    if (authenticated && token) {
      fetchEvents();
    }
  }, [authenticated, token]);

  // Handle form submission with API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the payload according to EventRequest structure
      const eventPayload = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        description: formData.description,
        featured: formData.featured,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      let response;
      if (editingEvent) {
        // Update existing event
        let url = `${process.env.NEXT_PUBLIC_LARAVEL_BASE_URL}/api/admin/events/${editingEvent.id}`;

        response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(eventPayload),
        });
      } else {
        // Create new event
        let url = `${process.env.NEXT_PUBLIC_LARAVEL_BASE_URL}/api/admin/events`;

        response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(eventPayload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      await fetchEvents();
      setShowModal(false);
      setEditingEvent(null);
      resetForm();
    } catch (err) {
      console.error("Error saving event:", err);
      setError(
        err instanceof Error
          ? `Failed to save event: ${err.message}`
          : "Failed to save event"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete with API call
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      let url = `${process.env.NEXT_PUBLIC_LARAVEL_BASE_URL}/api/admin/events/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchEvents(); // Refresh the list
    } catch (error: unknown) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      content: "",
      description: "",
      featured: false,
      location: "",
      startDate: "",
      endDate: "",
      status: "active",
    });
  };

  // Open edit modal
  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      category: event.category || "",
      content: event.content || "",
      description: event.description || "",
      featured: event.featured || false,
      location: event.location || "",
      startDate: event.startDate || "",
      endDate: event.endDate || "",
      status: event.status || "active",
    });
    setShowModal(true);
  };

  // Open create modal
  const openCreateModal = () => {
    setEditingEvent(null);
    resetForm();
    setShowModal(true);
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
          />
          {!authenticated ? "Authenticating..." : "Loading Events..."}
        </motion.div>
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Events Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage maritime training events and workshops
            </p>
          </div>

          <div className="flex justify-end mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </motion.button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4">
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

                <p className="text-sm text-gray-600">
                  {filteredEvents.length} of {events.length} events
                </p>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-lg font-medium">
                              No events found
                            </p>
                            <p className="text-sm">
                              Create your first event to get started
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((event) => (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {event.category}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(event.startDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 line-clamp-1">
                              {event.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(event)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit event"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal */}
          <AnimatePresence>
            {showModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50"
                  onClick={() => setShowModal(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {editingEvent ? "Edit Event" : "Create New Event"}
                        </h2>
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter event title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            required
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select category</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Symposium">Symposium</option>
                            <option value="Conference">Conference</option>
                            <option value="Open House">Open House</option>
                            <option value="Training">Training</option>
                            <option value="Seminar">Seminar</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                startDate: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                endDate: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter event location"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Featured Event
                          </label>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.featured}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  featured: e.target.checked,
                                })
                              }
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label className="ml-3 text-sm text-gray-700">
                              Mark as featured event
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Enter event description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content *
                        </label>
                        <textarea
                          required
                          rows={6}
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Enter detailed event content"
                        />
                      </div>

                      <div className="flex justify-end gap-4 pt-6 border-t">
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {editingEvent ? "Update Event" : "Create Event"}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
