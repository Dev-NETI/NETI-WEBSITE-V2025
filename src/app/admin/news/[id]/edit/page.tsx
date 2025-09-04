"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getAuthToken } from "@/lib/laravel-auth";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";

interface EditNewsPageParams {
  id: string;
}

export default function EditNewsPage() {
  const params = useParams() as EditNewsPageParams;
  const newsId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    author_title: "",
    date: "",
    image: null as File | null,
    status: "published" as "published" | "archived",
  });

  const [currentImage, setCurrentImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const { admin } = useAuth();
  const { toasts, success: showSuccess, error: showError, removeToast } = useToast();
  
  // Check if user has news management role or super admin role
  const userRoles = admin?.roles || (admin?.role ? [admin.role] : []);
  const canManageNews = userRoles.includes('news_manager') || userRoles.includes('super_admin');

  console.log('🔍 NEWS EDIT PAGE DEBUG - User Access Check:', {
    admin,
    userRoles,
    canManageNews,
    newsId,
  });

  // Fetch existing news data
  useEffect(() => {
    if (newsId && canManageNews) {
      fetchNewsData();
    }
  }, [newsId, canManageNews]);

  const fetchNewsData = async () => {
    try {
      setInitialLoading(true);
      setError("");
      console.log("Fetching news data for ID:", newsId);

      // Get authentication token
      const token = getAuthToken();
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`/api/laravel/news/${newsId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("News fetch result:", result);

      if (result.success && result.data) {
        const newsData = result.data;
        
        // Populate form with existing data
        setFormData({
          title: newsData.title || "",
          excerpt: newsData.excerpt || "",
          content: newsData.content || "",
          author: newsData.author || "",
          author_title: newsData.author_title || "",
          date: newsData.date ? new Date(newsData.date).toISOString().split('T')[0] : "",
          image: null, // File input will be empty, but we'll show current image
          status: newsData.status || "published",
        });

        // Set current image URL if exists
        if (newsData.image_url) {
          setCurrentImage(newsData.image_url);
        } else if (newsData.image) {
          setCurrentImage(`${process.env.NEXT_PUBLIC_STORAGE}/news_images/${newsData.image}`);
        }

        console.log("News data loaded successfully");
      } else {
        setError(result.error || "Failed to fetch news article");
        showError("Loading Failed", result.error || "Failed to fetch news article");
      }
    } catch (error) {
      console.error("Error fetching news data:", error);
      const errorMessage = "An error occurred while fetching the news article";
      setError(errorMessage);
      showError("Error", errorMessage);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "excerpt",
      "content",
      "author",
      "author_title",
      "date",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in the ${field.replace("_", " ")} field`);
        showError("Validation Error", `Please fill in the ${field.replace("_", " ")} field`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("excerpt", formData.excerpt);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("author_title", formData.author_title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("status", formData.status);
      
      // Only append image if a new one was selected
      if (formData.image) {
        formDataToSend.append("image", formData.image);
        console.log("🔍 IMAGE UPLOAD DEBUG:", {
          fileName: formData.image.name,
          fileSize: formData.image.size,
          fileType: formData.image.type,
          storagePath: "storage/app/public/news_images"
        });
      }

      // Get Laravel Sanctum token
      const token = getAuthToken();
      if (!token) {
        setError("Authentication token not found. Please login again.");
        showError("Authentication Error", "Please login again.");
        return;
      }

      // Use POST with method spoofing for FormData (Laravel best practice)
      const response = await fetch(`/api/laravel/news/${newsId}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        console.log("News article updated successfully:", result.data);
        
        // Show success toast
        showSuccess(
          "Article Updated!",
          "Your news article has been updated successfully.",
          3000
        );

        // Redirect to news management page after a brief delay
        setTimeout(() => {
          router.push("/admin/news");
        }, 1500);
      } else {
        const errorMessage = result.errors
          ? Object.values(result.errors).flat().join(", ")
          : result.message || "Failed to update news article";
        
        showError("Update Failed", errorMessage);
        console.error("Error updating news:", result);
      }
    } catch (error) {
      console.error("Error updating news:", error);
      showError("Error", "An error occurred while updating the news article");
    } finally {
      setLoading(false);
    }
  };

  if (!canManageNews) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don&apos;t have permission to edit news articles.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (initialLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <main className="pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading article...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !formData.title) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <main className="pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Failed to Load Article
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link
                  href="/admin/news"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to News
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <ToastContainer toasts={toasts} onClose={removeToast} />

        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <Link
                  href="/admin/news"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Edit News Article
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Update your maritime news article
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter a compelling article title"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Article Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Write a brief, engaging description of the article..."
                    required
                  />
                  <p className="text-xs text-gray-500">This will appear as the preview text for your article</p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Article Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={14}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                    placeholder="Write your article content here..."
                    required
                  />
                  <p className="text-xs text-gray-500">You can resize this field vertically for more writing space</p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Publication Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="published">Published - Make article visible to readers</option>
                    <option value="archived">Archived - Hide from public view</option>
                  </select>
                </div>

                {/* Author Information */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Author Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Author Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        placeholder="Enter author's full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Author Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="author_title"
                        value={formData.author_title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        placeholder="e.g. Maritime Instructor, Senior Editor"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Publication Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    required
                  />
                  <p className="text-xs text-gray-500">When should this article be published?</p>
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Featured Image
                  </label>
                  
                  {/* Show current image if exists */}
                  {currentImage && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                      <div className="relative inline-block">
                        <img
                          src={currentImage}
                          alt="Current article image"
                          className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      {currentImage ? "Choose a new image to replace the current one" : "Choose an eye-catching image for your article"} • JPEG, PNG, JPG, GIF • Max 2MB
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                  <Link
                    href="/admin/news"
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-center border border-gray-300 font-medium"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Updating Article...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Article
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}