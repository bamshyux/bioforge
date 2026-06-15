import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB — too small for background uploads sent via server actions.
      bodySizeLimit: "50mb",
    },
    proxyClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
