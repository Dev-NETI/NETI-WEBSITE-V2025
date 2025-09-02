"use client";

import { motion } from "framer-motion";

export default function VideoHeaderSection() {
  return (
    <div className="relative bg-white">
      {/* Professional Video Header Section */}
      <section
        className="relative h-screen w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/assets/images/company_header.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Professional Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <div className="max-w-4xl mx-auto">
              {/* Main Heading */}
              <motion.h1
                className="text-5xl md:text-5xl font-bold mb-25 relative text-center"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  backgroundPosition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  background: `linear-gradient(45deg, #ffffff, #e0f2fe, #ffffff, #3b82f6, #ffffff, #60a5fa, #ffffff)`,
                  backgroundSize: "300% 300%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter:
                    "drop-shadow(0 0 25px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
                }}
              >
                Sailing Beyond Limits with Quality Education
              </motion.h1>
            </div>
          </div>
        </div>

        {/* Scroll Down Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group mb-15"
          onClick={() => {
            const newsSection = document.getElementById("articles");

            if (newsSection) {
              const rect = newsSection.getBoundingClientRect();
              const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
              const targetPosition = rect.top + scrollTop;

              window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
              });
            }
          }}
        >
          <motion.p
            className="text-white/80 font-medium text-sm uppercase tracking-wider group-hover:text-white transition-colors duration-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            Scroll Down
          </motion.p>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors duration-300">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2 group-hover:bg-white/80 transition-colors duration-300"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
