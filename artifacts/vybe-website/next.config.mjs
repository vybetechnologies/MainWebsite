/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Replit's preview proxy serves this app through a domain that differs
  // from localhost, so cross-origin dev requests must be explicitly allowed.
  allowedDevOrigins: ['*'],
};

export default nextConfig;
