import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signs and verifies unsubscribe tokens for transactional email opt-outs.
 *
 * Token = HMAC-SHA256(email, UNSUBSCRIBE_SECRET) encoded as base64url.
 * The email address is passed in the query string as a plain (URL-encoded)
 * value so the token cannot be recycled for a different address.
 */

function getSecret(): string {
  const secret =
    process.env["UNSUBSCRIBE_SECRET"] ?? process.env["SESSION_SECRET"];
  if (!secret) {
    throw new Error(
      "UNSUBSCRIBE_SECRET (or SESSION_SECRET) env var must be set",
    );
  }
  return secret;
}

export function signUnsubscribeToken(email: string): string {
  return createHmac("sha256", getSecret())
    .update(email.toLowerCase())
    .digest("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = signUnsubscribeToken(email.toLowerCase());
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

/**
 * Builds a fully-qualified unsubscribe URL for inclusion in outbound emails.
 * Falls back to a relative /api path when no base URL is configured
 * (which at minimum produces a valid relative link).
 */
export function buildUnsubscribeUrl(email: string): string {
  const base =
    process.env["API_PUBLIC_URL"] ??
    `https://${process.env["REPLIT_DEV_DOMAIN"] ?? "localhost"}/api`;
  const token = signUnsubscribeToken(email);
  const params = new URLSearchParams({ email, token });
  return `${base.replace(/\/$/, "")}/unsubscribe?${params.toString()}`;
}
