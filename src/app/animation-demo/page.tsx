"use client";

import { useState, useEffect } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import Navigation from "../../components/Navigation";
import VideoHeaderSection from "@/components/VideoHeaderSection";
import WhatWeOffer from "@/components/WhatWeOffer";

export default function AnimationDemoPage() {
  const [isClient, setIsClient] = useState(false);
  const { scrollY } = useScroll();

  // Smooth spring physics for better animations
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Parallax effects for all three images
  const skyY = useTransform(smoothScrollY, [0, 1800], [0, -100]);
  const cityScale = useTransform(smoothScrollY, [0, 1800], [1, 1.1]);

  // Smooth dissolve transition for images before video section
  const imageOpacity = useTransform(smoothScrollY, [0, 1300, 1500], [1, 1, 1]);

  // Video section dissolve transition
  const videoSectionOpacity = useTransform(smoothScrollY, [1100, 2500], [0, 1]);
  const videoSectionY = useTransform(smoothScrollY, [1500, 2500], [30, 0]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-2xl flex items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
          />
          <span className="font-semibold">Loading Training Center...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative bg-slate-50 flex flex-col"
        style={{ height: "300vh" }}
      >
        <Navigation />

        {/* Parallax Images with Dissolve Transition */}
        <div className="sticky top-0 overflow-hidden">
          <motion.section className="h-screen w-screen absolute flex items-center justify-center">
            {/* Interactive Text Overlay */}
            <motion.div className="text-center z-40">
              <motion.h1
                className="text-5xl md:text-8xl font-bold mb-25 relative text-center text-white"
                initial={{ opacity: 0, y: 100, scale: 0.5, rotateX: 90 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                }}
                style={{
                  filter: "drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.3))",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                Sailing Towards Success
              </motion.h1>
            </motion.div>
          </motion.section>

          <motion.section>
            {/* Images with parallax effects and dissolve opacity */}
            <motion.div className="relative z-10 h-full" style={{ y: skyY }}>
              <motion.img
                src="/assets/images/it-park.png"
                alt="IT Park Background"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <motion.div
                className="absolute top-0 left-0 w-full h-full z-20"
                style={{ scale: cityScale }}
              >
                <motion.img
                  src="/assets/images/view.png"
                  alt="City View"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                />
              </motion.div>
              <motion.div
                className="absolute top-0 left-0 w-full h-full z-30"
                style={{ y: skyY, scale: cityScale }}
              >
                <motion.img
                  src="/assets/images/building.png"
                  alt="Building"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.6 }}
                />
              </motion.div>
            </motion.div>
          </motion.section>
        </div>
      </div>
      {/* Video Header Section positioned at bottom after scroll */}
      <div className="relative z-10 mt-auto">
        <motion.section>
          <motion.div
            style={{ opacity: videoSectionOpacity, y: videoSectionY }}
          >
            <VideoHeaderSection />
          </motion.div>
        </motion.section>
      </div>
      <div className="relative z-10 mt-auto">
        <motion.section>
          <motion.div
            style={{ opacity: videoSectionOpacity, y: videoSectionY }}
          >
            <WhatWeOffer />
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}
