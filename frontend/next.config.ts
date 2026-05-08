import type { NextConfig } from 'next';

const backendUrl = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL)
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // production backend (auto-derived from NEXT_PUBLIC_API_URL)
      ...(backendUrl
        ? [
            {
              protocol: backendUrl.protocol.replace(':', '') as 'http' | 'https',
              hostname: backendUrl.hostname,
              port: backendUrl.port || '',
              pathname: '/uploads/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
