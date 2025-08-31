"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  X,
  PlayCircle,
  Award,
  Users,
  Globe,
} from "lucide-react";

interface CompanyProfileVideoProps {
  videoSrc?: string;
  posterImage?: string;
  title?: string;
  description?: string;
}

export default function CompanyProfileVideo({
  videoSrc = "https://netiaccess.com/assets/videos/company_profile.mp4",
  posterImage = "/assets/images/nttc.jpg",
  title = "NYK-Fil Maritime E-Training, Inc.",
  description = "Discover our journey in maritime excellence and professional training solutions",
}: CompanyProfileVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate random values once and store them
  const randomValues = useRef({
    organicShapes: Array.from({ length: 4 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      moveX: Math.random() * 200 - 100,
      moveY: Math.random() * 200 - 100,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 10,
    })),
    dots: Array.from({ length: 12 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 3,
    })),
    blobs: Array.from({ length: 3 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      moveX: Math.random() * 150 - 75,
      moveY: Math.random() * 150 - 75,
      delay: Math.random() * 6,
      duration: 18 + Math.random() * 12,
    })),
  });

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const companyStats = [
    { icon: Award, number: "25+", label: "Years of Excellence" },
    { icon: Users, number: "10,000+", label: "Trained Professionals" },
    { icon: Globe, number: "50+", label: "Countries Served" },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Abstract Animation Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Flowing Wave Lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              transform: 'scaleX(1.5)',
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}


        {/* Flowing Organic Shapes */}
        {randomValues.current.organicShapes.map((shape, i) => (
          <motion.div
            key={`organic-${i}`}
            className="absolute w-40 h-40 bg-gradient-to-br from-blue-500/25 to-white/15 rounded-full blur-xl"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
            }}
            animate={{
              x: [0, shape.moveX, 0],
              y: [0, shape.moveY, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        ))}

        {/* Diagonal Lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={`diagonal-${i}`}
            className="absolute w-1 h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"
            style={{
              left: `${10 + i * 20}%`,
              transform: `rotate(${15 + i * 10}deg)`,
              transformOrigin: 'center',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scaleY: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1,
            }}
          />
        ))}

        {/* Pulsing Dots */}
        {randomValues.current.dots.map((dot, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 bg-blue-300/70 rounded-full"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
            }}
            animate={{
              scale: [0, 3, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
          />
        ))}

        {/* Morphing Blobs */}
        {randomValues.current.blobs.map((blob, i) => (
          <motion.div
            key={`blob-${i}`}
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-600/30 to-purple-600/25 rounded-full blur-2xl"
            style={{
              left: `${blob.left}%`,
              top: `${blob.top}%`,
            }}
            animate={{
              x: [0, blob.moveX, 0],
              y: [0, blob.moveY, 0],
              scale: [1, 1.8, 1],
              rotate: [0, 180, 360],
              borderRadius: ["50%", "30%", "50%"],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: blob.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            COMPANY PROFILE
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Watch our journey of maritime excellence and discover how we're
            shaping the future of maritime education
          </motion.p>
        </motion.div>

        {/* Centered Video Player */}
        <div className="flex justify-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl w-full"
          >
            <div
              ref={containerRef}
              className="relative bg-black rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                poster={posterImage}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={handlePlayPause}
                preload="metadata"
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
                  />
                </div>
              )}


              {/* Video Controls */}
              <AnimatePresence>
                {(showControls || !isPlaying) && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                  >
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div
                        className="w-full h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
                        onClick={handleSeek}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          style={{
                            width: duration
                              ? `${(currentTime / duration) * 100}%`
                              : "0%",
                          }}
                          initial={false}
                        />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePlayPause}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleRestart}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleMute}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </motion.button>

                        <div className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleFullscreen}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        {isFullscreen ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Maximize className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
