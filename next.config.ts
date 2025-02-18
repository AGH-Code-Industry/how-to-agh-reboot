import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    // Disable static rendered symbol that covers map button
    appIsrStatus: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
