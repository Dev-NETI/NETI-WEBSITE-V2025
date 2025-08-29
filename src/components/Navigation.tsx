"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Home,
  User,
  Phone,
  ChevronDown,
  FileText,
  Calendar,
  Award,
  Building,
} from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const { scrollY, scrollYProgress } = useScroll();

  // Parallax transforms for professional effect
  const navBlur = useTransform(scrollY, [0, 100], [8, 12]);
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"]
  );

  // Prevent body scroll when mega menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      dropdown: [
        {
          href: "/",
          label: "Overview",
          icon: Home,
          description: "Main page overview",
        },
        {
          href: "/#training",
          label: "Training Excellence",
          icon: Award,
          description: "Our training programs",
        },
        {
          href: "/#stats",
          label: "Statistics",
          icon: Building,
          description: "Company achievements",
        },
      ],
    },
    {
      href: "/about",
      label: "About",
      icon: User,
      dropdown: [
        {
          href: "/about",
          label: "About Us",
          icon: User,
          description: "Company overview",
        },
        {
          href: "/about#vision",
          label: "Vision & Mission",
          icon: Award,
          description: "Our goals and values",
        },
        {
          href: "/about#quality",
          label: "Quality Policy",
          icon: Building,
          description: "Our standards",
        },
      ],
    },
    {
      href: "#",
      label: "Articles",
      icon: FileText,
      dropdown: [
        {
          href: "/#articles",
          label: "Latest News",
          icon: Calendar,
          description: "Recent updates",
        },
        {
          href: "/news",
          label: "All Articles",
          icon: FileText,
          description: "Complete news archive",
        },
        {
          href: "/news/maritime",
          label: "Maritime Training",
          icon: Award,
          description: "Training-related news",
        },
        {
          href: "/news/technology",
          label: "Technology",
          icon: Building,
          description: "Tech innovations",
        },
      ],
    },
    {
      href: "/contact",
      label: "Contact",
      icon: Phone,
      dropdown: [
        {
          href: "/contact",
          label: "Contact Us",
          icon: Phone,
          description: "Get in touch",
        },
        // {
        //   href: "/contact#form",
        //   label: "Send Message",
        //   icon: Mail,
        //   description: "Contact form",
        // },
        {
          href: "/contact#office",
          label: "Visit Office",
          icon: Building,
          description: "View our location on the map",
        },
      ],
    },
  ];

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 transition-all duration-300 opacity-100"
        style={{
          backdropFilter: `blur(${navBlur}px)`,
          backgroundColor: navBackground,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div className="flex items-center gap-3">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <Image
                    src="/assets/images/NETI.svg"
                    alt="NETI Logo"
                    width={120}
                    height={40}
                    className="h-8 lg:h-10 w-auto"
                    priority
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Horizontal Mega Menu Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.dropdown &&
                    item.dropdown.some((sub) => pathname === sub.href));
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? "text-white bg-blue-600 font-semibold"
                          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/80"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-blue-600 z-0"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-300 ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-blue-50 border border-blue-200 text-slate-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 shadow-sm"
            >
              <div className="relative w-6 h-6">
                <motion.span
                  className="absolute top-1 left-0 w-full h-0.5 bg-current rounded-full"
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 8 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute top-3 left-0 w-full h-0.5 bg-current rounded-full"
                  animate={{
                    opacity: isMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute top-5 left-0 w-full h-0.5 bg-current rounded-full"
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -8 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="h-1 bg-blue-600 origin-left"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Horizontal Mega Dropdown Menus */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-slate-200/50 shadow-2xl z-40"
              onMouseEnter={() => setActiveDropdown(activeDropdown)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {navItems.find((item) => item.label === activeDropdown)
                  ?.dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {/* Section Title */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        {(() => {
                          const currentSection = navItems.find(
                            (item) => item.label === activeDropdown
                          );
                          return currentSection ? (
                            <>
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                                <currentSection.icon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-slate-800">
                                  {currentSection.label}
                                </h3>
                                <p className="text-slate-500">
                                  Explore our{" "}
                                  {currentSection.label.toLowerCase()} options
                                </p>
                              </div>
                            </>
                          ) : null;
                        })()}
                      </div>
                    </div>

                    {/* Mega Menu Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {navItems
                        .find((item) => item.label === activeDropdown)
                        ?.dropdown?.map((dropdownItem, index) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.1 + index * 0.05,
                              }}
                              className="group bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                                  <dropdownItem.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                                    {dropdownItem.label}
                                  </h4>
                                  <p className="text-sm text-slate-600 leading-relaxed">
                                    {dropdownItem.description}
                                  </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400 rotate-[-90deg] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-white/98 backdrop-blur-xl z-50 overflow-y-auto"
          >
            {/* Mobile Menu Content */}
            <div className="min-h-full py-20 px-6">
              <div className="max-w-md mx-auto">
                {/* Mobile Menu Items */}
                {navItems.map((section, index) => (
                  <motion.div
                    key={section.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="mb-8"
                  >
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <section.icon className="w-5 h-5 text-blue-600" />
                      {section.label}
                    </h3>
                    <div className="space-y-2">
                      {section.dropdown?.map((item, itemIndex) => (
                        <Link key={item.href} href={item.href}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.1 + itemIndex * 0.05 + 0.1,
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-slate-700">
                              {item.label}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white"
                >
                  <h3 className="text-lg font-bold mb-2">Get Started</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Access your maritime training portal
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-white text-blue-600 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    NETIACCESS
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
