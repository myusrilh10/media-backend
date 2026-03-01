import type { NextConfig } from "next";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

const nextConfig: NextConfig = {
  // Proxy /uploads/* to Strapi so next/image never fetches from a private IP
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${STRAPI_URL}/uploads/:path*`,
      },
    ];
  },
  images: {
    // Allow images served through the proxy (same origin, no private IP issue)
    remotePatterns: [
      // Add your production Strapi hostname here, e.g.:
      // { protocol: 'https', hostname: 'cms.example.com', pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
