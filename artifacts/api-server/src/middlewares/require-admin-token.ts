import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";

/**
 * Guards internal/admin-only endpoints with a single shared-secret token.
 *
 * This is intentionally lightweight (no user accounts, no sessions) — these
 * endpoints expose aggregate, non-PII data (e.g. page-view counts) to a
 * small internal audience, not customer data. The token is supplied via the
 * `x-admin-token` header and compared using a timing-safe check.
 */
export function requireAdminToken(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.ADMIN_ANALYTICS_TOKEN;
  if (!expected) {
    req.log.error("ADMIN_ANALYTICS_TOKEN is not configured; refusing admin request");
    res.status(503).json({ error: "Admin access is not configured" });
    return;
  }

  const provided = req.header("x-admin-token") ?? "";
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);

  const isMatch =
    expectedBuf.length === providedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, providedBuf);

  if (!isMatch) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
