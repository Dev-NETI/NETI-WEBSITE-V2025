"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Star,
  CheckCircle,
  AlertCircle,
  Archive,
  TrendingUp
} from "lucide-react";
import { NewsArticle } from "@/lib/news-db";
import { usePermissions } from "@/hooks/usePermissions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";
import Image from "next/image";

interface NewsApiResponse {
  success: boolean;
  data: NewsArticle[];
  count: number;
  error?: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsArticle | null>(null);
  const { canManageNews } = usePermissions();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching news articles...");
      
      const response = await fetch("/api/news");
      const result: NewsApiResponse = await response.json();
      
      console.log("News fetch result:", result);
      
      if (result.success) {
        setNews(result.data);
        console.log(`Loaded ${result.data.length} news articles`);
      } else {
        setError(result.error || "Failed to fetch news articles");
        console.error("Error fetching news:", result.error);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("An error occurred while fetching news articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (newsItem: NewsArticle) => {
    try {
      setLoading(true);
      console.log("Deleting news article:", newsItem.id);
      
      const response = await fetch(`/api/news/${newsItem.id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("News article deleted successfully");
        await fetchNews(); // Refresh the list
        setIsDeleteConfirmOpen(false);
        setNewsToDelete(null);
      } else {
        setError(result.error || "Failed to delete news article");
        console.error("Error deleting news:", result.error);
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      setError("An error occurred while deleting the news article");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newsId: string, newStatus: string) => {
    try {
      console.log("Updating news status:", newsId, newStatus);
      
      const response = await fetch(`/api/news/${newsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("News status updated successfully");
        await fetchNews(); // Refresh the list
      } else {
        setError(result.error || "Failed to update news status");
        console.error("Error updating news status:", result.error);
      }
    } catch (error) {
      console.error("Error updating news status:", error);
      setError("An error occurred while updating the news status");
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(news.map(item => item.category))];
  const totalViews = news.reduce((sum, item) => sum + item.views, 0);
  const publishedCount = news.filter(item => item.status === 'published').length;
  const draftCount = news.filter(item => item.status === 'draft').length;

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!canManageNews) {
    return (
      <ProtectedRoute >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don&apos;t have permission to manage news articles.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute >
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
                  <p className="text-gray-600 mt-2">Manage maritime news articles and updates</p>
                </div>
                <Link
                  href="/admin/news/create"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Create Article
                </Link>
              </motion.div>

              {/* Statistics */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Edit className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Drafts</p>
                      <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Articles</p>
                      <p className="text-2xl font-bold text-gray-900">{news.length}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Filters */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </motion.div>
            )}

            {/* News List */}
            <motion.div variants={containerVariants} className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading news articles...</p>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">No news articles found</p>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first news article to get started"}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredNews.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Article Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Eye className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Article Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                  {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                  {item.excerpt}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                  {getStatusIcon(item.status)}
                                  {item.status}
                                </span>
                                {item.featured && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    <Star className="w-3 h-3" />
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {item.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {item.views.toLocaleString()} views
                              </div>
                              <div className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {item.category}
                              </div>
                            </div>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex items-center gap-2 mb-4">
                                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{item.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/news/${item.id}/edit`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => {
                                    setNewsToDelete(item);
                                    setIsDeleteConfirmOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {item.status === 'draft' && (
                                  <button
                                    onClick={() => handleStatusUpdate(item.id, 'published')}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Publish
                                  </button>
                                )}
                                {item.status === 'published' && (
                                  <button
                                    onClick={() => handleStatusUpdate(item.id, 'archived')}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                  >
                                    <Archive className="w-4 h-4" />
                                    Archive
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteConfirmOpen && newsToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Article</h3>
                    <p className="text-gray-600 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete &quot;{newsToDelete.title}&quot;?
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteConfirmOpen(false);
                      setNewsToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteNews(newsToDelete)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}