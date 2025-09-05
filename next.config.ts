import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "neti-backend.neti.com.ph",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/, // applies to .js, .ts, .jsx, .tsx files
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
