import type { NextConfig } from "next";

const RECIPE_URL = "http://83.228.192.104:18081";
const ITEMS_URL = "http://83.228.192.104:18083";
const CHECKOUT_URL = "http://83.228.192.104:18082";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/recipes/:path*", destination: `${RECIPE_URL}/:path*` },
      { source: "/api/items/:path*", destination: `${ITEMS_URL}/:path*` },
      { source: "/api/checkout/:path*", destination: `${CHECKOUT_URL}/:path*` },
    ];
  },
};

export default nextConfig;
