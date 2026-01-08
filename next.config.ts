import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://83.228.192.104:18081/";

const nextConfig: NextConfig = {
   async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
