import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ['http://192.168.0.162', 'http://localhost:3000'],
  },
};

export default nextConfig;


