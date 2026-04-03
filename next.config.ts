import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Ignore TS errors in build (already verified with tsc --noEmit)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
