import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  output: isDev ? undefined : "export",
  images: {
    unoptimized: true,
  },
  // Enable rewrites ONLY in development to bypass CORS
  ...(isDev ? {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.API_URL || "https://api.sidlabs.shop/api"}/:path*`,
        },
      ];
    },
  } : {}),
};

export default nextConfig;
