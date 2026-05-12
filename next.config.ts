import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ ADD THIS
        pathname: '/**',
      },
    ],
  },
  experimental: {
    proxyClientMaxBodySize: '35mb',
    serverActions: {
      bodySizeLimit: '35mb',
    },
  },
};

export default nextConfig;
