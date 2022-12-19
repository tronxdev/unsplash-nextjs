/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Recommended for the `pages` directory, default in `app`.
  experimental: {
    // Required:
    appDir: true,
    forceSwcTransforms: true,
  },
  images: {
    // domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
    ],
  },
  output: 'standalone',
  env: {
    HOST: process.env.HOST,
  },
};

module.exports = nextConfig;
