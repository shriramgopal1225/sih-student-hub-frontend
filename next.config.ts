import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Set your desired limit here, e.g., '10mb' or '1000kb'
    },
  },
};

export default nextConfig;
