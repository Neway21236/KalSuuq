/** @type {import('next').NextConfig} */
const nextConfig = {
  // Risk #7 Fix: CDN Image Configuration
  // When you migrate images to Cloudinary or S3, add their domains here.
  // This allows next/image to optimize and serve them from the global Edge CDN.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/kalsuq/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
    ],
    // Serve modern formats for performance
    formats: ['image/avif', 'image/webp'],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
};

export default nextConfig;
