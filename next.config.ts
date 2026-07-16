import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles output automatically — no standalone needed
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Ensure Prisma client is bundled correctly
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "stream.mux.com" },
    ],
  },
};

export default nextConfig;
