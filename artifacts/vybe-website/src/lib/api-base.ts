/**
 * The website (static export, Cloudflare Pages) and the API server (Fly.io)
 * are deployed to different origins in production, so relative `/api/...`
 * fetches only work in the Replit dev preview, where both are reachable
 * through the same shared proxy origin.
 *
 * In any other environment (production, or a plain `localhost` run outside
 * Replit) we point requests at the API server's own domain instead.
 */
const REPLIT_DEV_HOSTNAME_PATTERN = /\.replit\.dev$/;

export const DEFAULT_PRODUCTION_API_URL = 'https://vybe-api-server.fly.dev';

export function resolveApiBaseUrl(hostname: string): string | null {
  if (REPLIT_DEV_HOSTNAME_PATTERN.test(hostname) || hostname === 'localhost') {
    // Same-origin dev proxy already routes /api/* to the api-server workflow.
    return null;
  }
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_PRODUCTION_API_URL;
}
