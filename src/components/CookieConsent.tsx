"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check } from "lucide-react";

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
    preferences: true,
  });

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Load saved settings
      try {
        const savedSettings = JSON.parse(cookieConsent);
        setSettings({ ...settings, ...savedSettings });
      } catch (error) {
        console.error("Error parsing cookie settings:", error);
      }
    }
  }, [settings]);

  const acceptAll = () => {
    const allAccepted: CookieSettings = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setSettings(allAccepted);
    setShowBanner(false);

    // Initialize analytics and other services here
    initializeServices(allAccepted);
  };

  const acceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(settings));
    setShowBanner(false);
    setShowSettings(false);

    // Initialize only selected services
    initializeServices(settings);
  };

  const rejectNonEssential = () => {
    const essentialOnly: CookieSettings = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    localStorage.setItem("cookie-consent", JSON.stringify(essentialOnly));
    setSettings(essentialOnly);
    setShowBanner(false);

    // Initialize only essential services
    initializeServices(essentialOnly);
  };

  const initializeServices = (cookieSettings: CookieSettings) => {
    // Initialize analytics
    if (cookieSettings.analytics) {
      // Add Google Analytics or other analytics code here
      console.log("Analytics enabled");
    }

    // Initialize marketing cookies
    if (cookieSettings.marketing) {
      // Add marketing pixels, tracking codes here
      console.log("Marketing cookies enabled");
    }

    // Initialize preferences
    if (cookieSettings.preferences) {
      // Add preference-based customizations
      console.log("Preferences enabled");
    }
  };

  const toggleSetting = (key: keyof CookieSettings) => {
    if (key === "essential") return; // Cannot disable essential cookies

    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => !showSettings && setShowBanner(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 left-6 right-6 md:left-8 md:right-8 lg:max-w-md lg:left-8 lg:right-auto z-50"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Cookie Preferences
                  </h3>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  We use cookies to enhance your browsing experience, provide
                  personalized content, and analyze our traffic. These help us
                  improve our website performance and provide you with better
                  services.
                </p>

                {!showSettings && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Essential cookies are always enabled</span>
                  </div>
                )}
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="space-y-4 border-t border-slate-200 pt-4">
                      {/* Essential Cookies */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">
                            Essential
                          </h4>
                          <p className="text-xs text-slate-500">
                            Required for basic website functionality
                          </p>
                        </div>
                        <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">
                            Analytics
                          </h4>
                          <p className="text-xs text-slate-500">
                            Help us improve our website
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("analytics")}
                          className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                            settings.analytics
                              ? "bg-blue-500 justify-end"
                              : "bg-slate-300 justify-start"
                          }`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>

                      {/* Marketing Cookies */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">
                            Marketing
                          </h4>
                          <p className="text-xs text-slate-500">
                            Personalized ads and content
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("marketing")}
                          className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                            settings.marketing
                              ? "bg-blue-500 justify-end"
                              : "bg-slate-300 justify-start"
                          }`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>

                      {/* Preferences Cookies */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">
                            Preferences
                          </h4>
                          <p className="text-xs text-slate-500">
                            Remember your settings and choices
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSetting("preferences")}
                          className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                            settings.preferences
                              ? "bg-blue-500 justify-end"
                              : "bg-slate-300 justify-start"
                          }`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="space-y-3">
                {showSettings ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={acceptSelected}
                      className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 shadow-lg"
                    >
                      Save Preferences
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={rejectNonEssential}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Reject All
                      </button>
                      <button
                        onClick={acceptAll}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 shadow-lg"
                      >
                        Accept All
                      </button>
                    </div>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
