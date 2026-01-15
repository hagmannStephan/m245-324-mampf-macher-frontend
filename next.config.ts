import type { NextConfig } from "next";

const recipeUrl = "http://83.228.192.104:18081";
const checkoutUrl = "http://83.228.192.104:18082";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/backend/:path*", destination: `${recipeUrl}/:path*` },
      { source: "/api/checkout/:path*", destination: `${checkoutUrl}/:path*` },
    ];
  },
};

export default nextConfig;
