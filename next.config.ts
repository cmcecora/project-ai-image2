import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Help Next resolve project root correctly in multi-lockfile environments
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // REMOVED: Pollinations AI - only using Midjourney and Mage.space
      // {
      //   protocol: 'https',
      //   hostname: 'image.pollinations.ai',
      // },
      {
        protocol: 'https',
        hostname: 'cdn.midjourney.com',
      },
      {
        protocol: 'https',
        hostname: 'mage.space',
      },
      {
        protocol: 'https',
        hostname: '*.mage.space',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'pbxt.replicate.delivery',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
