"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Facebook } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Services", href: "/services" },
      { name: "Training Courses", href: "/courses" },
      { name: "Contact", href: "/contact" },
    ],
    services: [
      { name: "Maritime Training", href: "https://netiaccess.com" },
      // { name: "E-Learning Solutions", href: "/services#elearning" },
      // { name: "Certification Programs", href: "/services#certification" },
      // { name: "Consulting Services", href: "/services#consulting" },
    ],
    support: [
      { name: "Help Center", href: "/support" },
      { name: "Training Resources", href: "/resources" },
      { name: "Student Portal", href: "/portal" },
      { name: "FAQ", href: "/faq" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/NETICertified",
      color: "hover:text-blue-400",
    },
    // { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    // {
    //   name: "LinkedIn",
    //   icon: Linkedin,
    //   href: "#",
    //   color: "hover:text-blue-400",
    // },
    // {
    //   name: "Instagram",
    //   icon: Instagram,
    //   href: "#",
    //   color: "hover:text-blue-400",
    // },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "neti@neti.com.ph",
      href: "mailto:neti@neti.com.ph",
    },
    {
      icon: Phone,
      text: "(049) 508-8600",
      href: "tel:(049) 508-8600",
    },
    // {
    //   icon: MapPin,
    //   text: "Knowledge Avenue, Carmeltown, Canlubang, Calamba City 4037, Laguna, Philippines",
    //   href: "#",
    // },
  ];

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

  return (
    <footer className="relative bg-white text-slate-800 overflow-hidden border-t border-slate-200">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10"
      >
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="mb-6">
                <div className="mb-4">
                  <Image
                    src="/assets/images/NETI.svg"
                    alt="NETI Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto mb-4"
                    priority
                  />
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Leading maritime training and e-learning solutions provider,
                  dedicated to excellence in maritime education and professional
                  development.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    variants={itemVariants}
                    className="flex items-center space-x-3 text-slate-600 hover:text-slate-800 transition-colors duration-300 group"
                  >
                    <contact.icon className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                    <span className="text-sm">{contact.text}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-slate-800 mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-blue-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-slate-800 mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-blue-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support & Social */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-slate-800 mb-6">
                Support
              </h4>
              <ul className="space-y-3 mb-8">
                {footerLinks.support.map((link, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-blue-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Social Media Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all duration-300 border border-blue-200 hover:border-blue-300`}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-slate-200 bg-slate-50/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-slate-600">
                © {currentYear} NYK-Fil Maritime E-Training, Inc. All rights
                reserved.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm text-slate-600">
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
