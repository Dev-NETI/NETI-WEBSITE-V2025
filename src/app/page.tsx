"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import Navigation from "../components/Navigation";
import VideoHeaderSection from "../components/VideoHeaderSection";
import { Award } from "lucide-react";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Scroll-based parallax values - only use global scroll to avoid ref hydration issues
  const { scrollY } = useScroll();

  // Background parallax effects
  const backgroundY = useTransform(scrollY, [0, 1500], [0, -500]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
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
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white relative overflow-hidden"
    >
      {/* Professional Navigation */}
      <Navigation />

      {/* Subtle Professional Background Elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden opacity-60"
        style={{
          y: backgroundY,
        }}
      >
        {/* Minimal Professional Background Shapes */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-100/40 to-slate-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-slate-100/40 to-blue-100/40 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Main Content */}
      <div className="pt-20">
        {/* Video Header Section with Articles */}
        <VideoHeaderSection />

        {/* NETI Training Excellence Section */}
        <motion.section
          className="py-24 relative overflow-hidden"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Full Background Image */}
          <div className="absolute inset-0">
            <motion.div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url(/assets/images/nttc.jpg)",
                // transform: "translateX(-500px)",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            {/* Professional overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-blue-900/75 to-slate-800/85" />
          </div>

          {/* Professional Content Layout */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
              {/* Left Side - Visual Balance */}
              <div className="lg:order-1 hidden lg:block"></div>

              {/* Content Side - Professional Right Layout */}
              <motion.div
                className="lg:order-2 space-y-8"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Award className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">
                    ISO 9001:2008 Certified
                  </span>
                </motion.div>

                <motion.h2
                  className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  Excellence in Maritime Training
                </motion.h2>

                <motion.p
                  className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  Much of our success stems from our adherence to very high
                  training standards and compliance to a{" "}
                  <span className="text-blue-200 font-semibold">
                    &ldquo;No Training No Deployment Policy,&rdquo;
                  </span>{" "}
                  which is realized through our in-house training center,
                  NYK-Fil Maritime E-Training Inc. (NETI).
                </motion.p>

                <motion.p
                  className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  viewport={{ once: true }}
                >
                  An ISO 9001:2008 certified company, NETI is engaged in
                  maritime training using state-of-the-art equipment and
                  develops customized training courses designed to meet the
                  specific requirements of Principals.
                </motion.p>

                {/* Professional Key Features */}
                <motion.div
                  className="space-y-6 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0 shadow-lg" />
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        MARINA Recognition
                      </h4>
                      <p className="text-white/90 text-base leading-relaxed">
                        Duly recognized by the Maritime Industry Authority
                        (MARINA) for practical assessment of newly passed Marine
                        Deck and Engine Officers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0 shadow-lg" />
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        Full Mission Bridge Simulator
                      </h4>
                      <p className="text-white/90 text-base leading-relaxed">
                        Developed scenarios for practical assessment and
                        computerized grading of examinees&apos; performance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0 shadow-lg" />
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        Expert Instructors
                      </h4>
                      <p className="text-white/90 text-base leading-relaxed">
                        Active merchant marine officers fresh from onboard
                        assignments, mostly &ldquo;home-grown&rdquo; from our
                        cadetship training programs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0 shadow-lg" />
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        JSU-AMOSUP Training Levy
                      </h4>
                      <p className="text-white/90 text-base leading-relaxed">
                        Houses the Diesel Plant Simulator under the auspices of
                        the IMMAJ/PJMCC in Canlubang, Calamba City
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
