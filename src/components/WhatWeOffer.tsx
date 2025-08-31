"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Anchor,
  Shield,
  BookOpen,
  TrendingUp,
  Building,
  Ship,
  Flag,
  X,
  ChevronRight,
  Award,
  Users,
  CheckCircle,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    id: "nmc",
    title: "NMC",
    shortDesc: "Comprehensive maritime education and training programs",
    icon: Anchor,
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    description:
      "Our NMC courses are designed to prepare students for successful careers in the maritime industry with hands-on training and theoretical knowledge.",
    features: [
      "Navigation and Seamanship",
      "Maritime Law and Regulations",
      "Ship Operations and Management",
      "Safety Procedures and Emergency Response",
      "Maritime Communication Systems",
      "Cargo Handling and Stowage",
    ],
  },
  {
    id: "nmcr",
    title: "NMCR",
    shortDesc: "Refresher courses for maritime professionals",
    icon: Shield,
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-teal-500/20",
    description:
      "NMCR refresher courses are mandatory for maritime professionals to maintain their certifications and stay updated with the latest maritime regulations, technologies, and safety procedures. These courses ensure continuous professional development.",
    features: [
      "Updated Maritime Regulations",
      "Advanced Safety Procedures",
      "New Technology Integration",
      "Emergency Response Updates",
      "Environmental Protection Standards",
      "International Maritime Standards",
    ],
  },
  {
    id: "mandatory",
    title: "MANDATORY",
    shortDesc: "Essential safety and compliance training",
    icon: BookOpen,
    color: "text-orange-400",
    bgGradient: "from-orange-500/20 to-red-500/20",
    description:
      "Mandatory training courses are required by international maritime law for all seafarers. These courses cover essential safety protocols, survival techniques, and emergency procedures that every maritime professional must know.",
    features: [
      "Personal Survival Techniques (PST)",
      "Fire Prevention and Fire Fighting",
      "Elementary First Aid",
      "Personal Safety and Social Responsibilities",
      "Security Awareness Training",
      "Basic Safety Training (BST)",
    ],
  },
  {
    id: "upgrading",
    title: "UPGRADING",
    shortDesc: "Career advancement and skill enhancement",
    icon: TrendingUp,
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    description:
      "Upgrading courses are designed for maritime professionals looking to advance their careers and obtain higher-level certifications. These programs focus on leadership, advanced technical skills, and management capabilities.",
    features: [
      "Leadership and Management Training",
      "Advanced Navigation Systems",
      "Ship Management and Operations",
      "Maritime Business and Economics",
      "Advanced Safety Management",
      "Port State Control and Inspections",
    ],
  },
  {
    id: "government",
    title: "OTHER GOVERNMENT",
    shortDesc: "Specialized government-mandated programs",
    icon: Building,
    color: "text-indigo-400",
    bgGradient: "from-indigo-500/20 to-blue-500/20",
    description:
      "Specialized training programs mandated by various government agencies and international maritime organizations. These courses ensure compliance with specific regulations and standards required for different maritime operations.",
    features: [
      "Port Facility Security Officer (PFSO)",
      "Designated Security Duties",
      "Maritime Security Awareness",
      "Vessel Security Officer Training",
      "Company Security Officer (CSO)",
      "Anti-Piracy and Security Measures",
    ],
  },
  {
    id: "jiss",
    title: "JISS",
    shortDesc: "Japanese International Ship-owners Standard",
    icon: Ship,
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    description:
      "JISS training programs follow the Japanese International Ship-owners Standard, focusing on high-quality maritime training that meets Japanese shipping company requirements and international best practices.",
    features: [
      "Japanese Maritime Standards",
      "Quality Management Systems",
      "Advanced Ship Operations",
      "Cultural Competency Training",
      "Japanese Company Procedures",
      "International Best Practices",
    ],
  },
  {
    id: "panama",
    title: "PANAMA",
    shortDesc: "Panama flag state requirements and procedures",
    icon: Flag,
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
    description:
      "Specialized training for vessels operating under the Panama flag, covering specific requirements, procedures, and regulations mandated by the Panama Maritime Authority for safe and compliant vessel operations.",
    features: [
      "Panama Flag State Regulations",
      "Certificate Requirements and Procedures",
      "Inspection and Survey Protocols",
      "Documentation and Compliance",
      "Panama Maritime Authority Standards",
      "International Convention Compliance",
    ],
  },
];

export default function WhatWeOffer() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
    },
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Animated Background Dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`bg-dot-${i}`}
            className="absolute w-1 h-1 bg-blue-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            {/* Section Header */}
            <div className="mb-8">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                WHAT WE OFFER
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <p className="text-xl text-gray-600 leading-relaxed">
                  Comprehensive maritime training programs designed to meet
                  international standards and advance your maritime career with
                  world-class education and certification.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  At NYK-Fil Maritime E-Training Inc., we provide specialized
                  training courses that comply with international maritime
                  regulations and industry best practices. Our programs are
                  designed to equip maritime professionals with the knowledge
                  and skills needed to excel in today&apos;s competitive maritime
                  industry.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  From mandatory safety training to advanced upgrading courses,
                  we offer a complete range of maritime education solutions.
                  Each program is delivered by experienced instructors using
                  state-of-the-art facilities and modern training methodologies.
                </p>
              </motion.div>
            </div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-600" />
                Why Choose NETI?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    STCW-compliant training programs
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    Experienced maritime instructors
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    Modern training facilities
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    International certifications
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    Job placement assistance
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    variants={cardVariants}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedService(service)}
                    className="group relative bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
                  >
                    {/* Card Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${service.color}`}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors leading-tight">
                        {service.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {service.shortDesc}
                      </p>

                      {/* Learn More Button */}
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                        <span>Learn More</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div
                className={`relative p-8 bg-gradient-to-br ${selectedService.bgGradient} rounded-t-3xl`}
              >
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center`}
                  >
                    <selectedService.icon
                      className={`w-8 h-8 ${selectedService.color}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedService.title}
                    </h2>
                    <p className="text-gray-700 text-lg">
                      {selectedService.shortDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Program Overview
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedService.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    What You&apos;ll Learn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedService.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    Enroll Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
