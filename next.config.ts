import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // {
      //     protocol: 'http',
      //     hostname: 'localhost',
      //     port: '8000',
      //     pathname: '/storage/**',
      // },
      {
        protocol: "https",
        hostname: "neti-backend.neti.com.ph",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
