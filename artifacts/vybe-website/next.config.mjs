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
  // Clerk's publishable key is not a secret — it's meant to ship to the
  // browser — but it's provisioned under CLERK_PUBLISHABLE_KEY, not a
  // NEXT_PUBLIC_-prefixed name that Next.js would inline automatically.
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '',
  },
};

export default nextConfig;
