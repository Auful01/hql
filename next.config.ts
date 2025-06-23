import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // atau sesuai kebutuhan, misalnya '50mb'
    },
  },
};

export default nextConfig;
