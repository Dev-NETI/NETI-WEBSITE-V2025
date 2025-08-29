"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import GoogleMap from "../../components/GoogleMap";
import {
  ArrowRight,
  Mail,
  Phone,
  Clock,
  Send,
  MessageSquare,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            result.message ||
            "Thank you for your message! We will get back to you soon.",
        });
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          company: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Clock,
      title: "Working Hours",
      value: "Monday - Friday",
      description: "8:00 AM - 5:00 PM",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: Phone,
      title: "Laguna Office",
      value: "(049) 508-8600",
      description: "Main hotline",
      color: "from-indigo-600 to-purple-600",
    },
    {
      icon: Phone,
      title: "Manila Office",
      value: "(02) 908-4900",
      description: "Manila branch",
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@neti-portal.com",
      description: "Send us an email",
      color: "from-pink-600 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-20 text-center"
        >
          <div className="max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-slate-800 mb-6"
            >
              Get In Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Ready to start your next project? Let&apos;s discuss how we can
              help transform your business with innovative technology solutions.
            </motion.p>
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                  className="bg-white backdrop-blur-sm rounded-3xl p-8 border border-slate-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0`}
                    whileHover={{ opacity: 0.15 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10 text-center">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{
                        rotate: 360,
                        scale: 1.2,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <info.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-2">
                      {info.value}
                    </p>
                    <p className="text-slate-600 text-sm">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Quick Links Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Quick Links
              </h2>
              <p className="text-xl text-slate-600">
                Access our services and resources with just one click
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Enroll Now!",
                  description: "Start your maritime training journey",
                  icon: Users,
                  href: "https://netiaccess.com",
                  color: "from-blue-600 to-indigo-600",
                },
                // {
                //   title: "NETI Enrollment Site",
                //   description: "Official enrollment portal",
                //   icon: Globe,
                //   href: "#",
                //   color: "from-indigo-600 to-purple-600",
                // },
                {
                  title: "NYK-FIL Website",
                  description: "Visit our parent company",
                  icon: ArrowRight,
                  href: "https://www.nykfil.com.ph",
                  color: "from-purple-600 to-pink-600",
                },
                {
                  title: "NTMA Website",
                  description: "National Training Management Association",
                  icon: ArrowRight,
                  href: "https://ntma.edu.ph/home/index",
                  color: "from-pink-600 to-red-600",
                },
                // {
                //   title: "NETI Webmail",
                //   description: "Access your email account",
                //   icon: Mail,
                //   href: "#",
                //   color: "from-red-600 to-orange-600",
                // },
                {
                  title: "TDG Human Resource Management, Inc.",
                  description: "HR management services",
                  icon: Users,
                  href: "https://tdg-smdmanpower.com/thrm.php",
                  color: "from-orange-600 to-yellow-600",
                },
              ].map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 group h-full"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <link.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {link.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 bg-white"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-200 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-slate-800 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <label className="block text-slate-700 mb-2 font-medium">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <label className="block text-slate-700 mb-2 font-medium">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        placeholder="your.email@company.com"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-slate-700 mb-2 font-medium">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Your company name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-slate-700 mb-2 font-medium">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </motion.div>

                  {/* Success/Error Feedback */}
                  {submitStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-xl border ${
                        submitStatus.type === "success"
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {submitStatus.type === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <p className="font-medium">{submitStatus.message}</p>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    viewport={{ once: true }}
                    whileHover={
                      !isSubmitting
                        ? {
                            scale: 1.02,
                            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                          }
                        : {}
                    }
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">
                    Why Choose Us?
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Users,
                        title: "Expert Team",
                        description:
                          "Experienced professionals with deep industry knowledge",
                      },
                      {
                        icon: Globe,
                        title: "Global Reach",
                        description:
                          "Serving clients worldwide with local expertise",
                      },
                      {
                        icon: MessageSquare,
                        title: "24/7 Support",
                        description:
                          "Round-the-clock assistance and maintenance",
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-slate-600">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
                  <h4 className="text-xl font-bold text-slate-800 mb-4">
                    Response Time
                  </h4>
                  <p className="text-slate-600 mb-4">
                    We typically respond to all inquiries within 24 hours during
                    business days.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">
                      24-hour response guarantee
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Google Map Section */}
        <GoogleMap />
      </div>
    </div>
  );
}
