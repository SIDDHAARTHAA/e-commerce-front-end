import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.sidlabs.shop/api/:path*",
      },
    ];
  },
};

export default nextConfig;
