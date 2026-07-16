import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, bookingRequestsTable, jobApplicationsTable } from "@workspace/db";

const router: IRouter = Router();

// ── Simple IP-based rate limiter ──────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT = 20; // 20 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60_000);

function getClientIp(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown"
  );
}

function validateEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  if (trimmed.length > 254) return null;
  return trimmed;
}

// ── GET /api/account/repairs ──────────────────────────────────────────────────

router.get("/account/repairs", async (req: Request, res: Response): Promise<void> => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many requests. Please wait and try again." });
    return;
  }

  const email = validateEmail(req.query.email);
  if (!email) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  try {
    const rows = await db
      .select({
        id: bookingRequestsTable.id,
        service: bookingRequestsTable.service,
        message: bookingRequestsTable.message,
        deviceType: bookingRequestsTable.deviceType,
        brandModel: bookingRequestsTable.brandModel,
        preferredDate: bookingRequestsTable.preferredDate,
        preferredServiceType: bookingRequestsTable.preferredServiceType,
        createdAt: bookingRequestsTable.createdAt,
        // Intentionally omitting: firstName, lastName, phone, photoObjectPath
      })
      .from(bookingRequestsTable)
      .where(eq(bookingRequestsTable.email, email));

    res.status(200).json({ repairs: rows });
  } catch (err) {
    req.log.error({ err }, "Failed to load account repairs");
    res.status(500).json({ error: "Failed to load repairs." });
  }
});

// ── GET /api/account/applications ────────────────────────────────────────────

router.get("/account/applications", async (req: Request, res: Response): Promise<void> => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many requests. Please wait and try again." });
    return;
  }

  const email = validateEmail(req.query.email);
  if (!email) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  try {
    const rows = await db
      .select({
        id: jobApplicationsTable.id,
        jobListingTitle: jobApplicationsTable.jobListingTitle,
        status: jobApplicationsTable.status,
        firstName: jobApplicationsTable.firstName,
        lastName: jobApplicationsTable.lastName,
        createdAt: jobApplicationsTable.createdAt,
        // Intentionally omitting: staffNotes, resumeObjectPath, coverLetter (verbose)
      })
      .from(jobApplicationsTable)
      .where(eq(jobApplicationsTable.email, email));

    res.status(200).json({ applications: rows });
  } catch (err) {
    req.log.error({ err }, "Failed to load account applications");
    res.status(500).json({ error: "Failed to load applications." });
  }
});

export default router;
