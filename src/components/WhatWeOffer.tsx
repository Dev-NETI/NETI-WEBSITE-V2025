"use client";

import { motion } from "framer-motion";
import { useServiceModal } from "@/contexts/ServiceModalContext";
import {
  Anchor,
  BookOpen,
  TrendingUp,
  Building,
  Ship,
  Flag,
  ChevronRight,
} from "lucide-react";
import CompanyProfileVideo from "./CompanyProfileVideo";

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
    title: "NMC & NMCR",
    shortDesc: "Comprehensive maritime education and training programs",
    icon: Anchor,
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    description:
      "Our NMC & NMCR courses are designed to prepare students for successful careers in the maritime industry with hands-on training and theoretical knowledge.",
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
    id: "mandatory",
    title: "STCW-MANDATORY TRAINING",
    shortDesc: "Essential safety and compliance training",
    icon: BookOpen,
    color: "text-orange-400",
    bgGradient: "from-orange-500/20 to-red-500/20",
    description:
      "STCW-Mandatory training courses are required by international maritime law for all seafarers. These courses cover essential safety protocols, survival techniques, and emergency procedures that every maritime professional must know.",
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
    title: "UPGRADING TRAINING",
    shortDesc: "Career advancement and skill enhancement",
    icon: TrendingUp,
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    description:
      "Upgrading training courses are designed for maritime professionals looking to advance their careers and obtain higher-level certifications. These programs focus on leadership, advanced technical skills, and management capabilities.",
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
  {
    id: "tesda",
    title: "TESDA",
    shortDesc:
      "Technical Education and Skills Development Authority certified programs",
    icon: Flag,
    color: "text-green-400",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    description:
      "TESDA-certified technical and vocational training programs that provide industry-recognized qualifications and competencies. Our TESDA courses are designed to meet national standards and provide pathways to employment and career advancement in the maritime and technical sectors.",
    features: [
      "National Certificates (NC) I-IV Programs",
      "Technical Vocational Education and Training",
      "Industry-Based Training Modules",
      "Competency Assessment and Certification",
      "Skills Enhancement and Upgrading Programs",
      "Employment-Ready Technical Skills Development",
    ],
  },
];

export default function WhatWeOffer() {
  const { openModal } = useServiceModal();

  return (
    <section className="p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: "url('/assets/images/nttc1.png')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start mb-8 sm:mb-12 lg:mb-16">
          {/* Left Column - What We Offer */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
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
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed text-justify">
                NETI offers comprehensive maritime training programs designed to
                meet international standards. Our programs equip maritime
                professionals with the knowledge and skills needed to excel in
                today&apos;s competitive maritime industry. From mandatory
                safety training to advanced upgrading and specialized courses,
                we ensure that each program is delivered by experienced
                instructors using state-of-the-art facilities and modern
                training methodologies.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Corporate Video */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <CompanyProfileVideo />
          </motion.div>
        </div>

        {/* Services Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => {
                  console.log('Card clicked:', service.title);
                  openModal(service);
                }}
                className="group relative bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 min-w-0"
              >
                {/* Card Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-15 rounded-xl transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="mb-2 sm:mb-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg bg-gradient-to-br ${service.bgGradient} flex items-center justify-center shadow-md`}
                    >
                      <IconComponent
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${service.color}`}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors leading-tight">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-gray-600 text-xs mb-2 sm:mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Learn More Button */}
                  <div className="flex items-center justify-center text-blue-600 text-xs font-medium group-hover:text-blue-700 transition-colors">
                    <span>Learn More</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
