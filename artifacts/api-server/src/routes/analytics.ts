import { Router, type IRouter } from "express";
import { sql, gte, desc } from "drizzle-orm";
import { db, pageViewsTable } from "@workspace/db";
import { requireAdminToken } from "../middlewares/require-admin-token";
import { cleanupOldPageViews } from "../jobs/pageViewCleanup";

const router: IRouter = Router();

// Very small in-memory throttle: this endpoint only increments a counter
// (no email sends, no PII, low blast radius), so a lightweight per-IP cap is
// enough to keep it from being a nuisance without the heavier abuse controls
// used on the booking/upload endpoints.
const MAX_REQUESTS_PER_WINDOW = 120;
const WINDOW_MS = 60_000;
const requestCounts = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

router.post("/analytics/pageview", async (req, res): Promise<void> => {
  const ip = req.ip ?? "unknown";
  if (isRateLimited(ip)) {
    res.status(204).end();
    return;
  }

  const path = typeof req.body?.path === "string" ? req.body.path : null;
  if (!path || !path.startsWith("/") || path.length > 300) {
    res.status(204).end();
    return;
  }

  try {
    await db
      .insert(pageViewsTable)
      .values({ path, viewDate: todayIsoDate(), count: 1 })
      .onConflictDoUpdate({
        target: [pageViewsTable.path, pageViewsTable.viewDate],
        set: { count: sql`${pageViewsTable.count} + 1`, updatedAt: new Date() },
      });
  } catch (err) {
    req.log.warn({ err }, "Failed to record page view");
  }

  res.status(204).end();
});

const MAX_REPORT_DAYS = 365;
const DEFAULT_REPORT_DAYS = 30;

function daysAgoIsoDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

// GET /analytics/pageviews — internal report of page-view counts by path.
// Protected by a shared admin token (see requireAdminToken) since this is
// for internal use only, not a public-facing dashboard.
router.get("/analytics/pageviews", requireAdminToken, async (req, res): Promise<void> => {
  const requestedDays = Number(req.query.days);
  const days =
    Number.isFinite(requestedDays) && requestedDays > 0
      ? Math.min(Math.floor(requestedDays), MAX_REPORT_DAYS)
      : DEFAULT_REPORT_DAYS;
  const since = daysAgoIsoDate(days);

  try {
    const totalsByPath = await db
      .select({
        path: pageViewsTable.path,
        totalViews: sql<number>`sum(${pageViewsTable.count})`.mapWith(Number),
      })
      .from(pageViewsTable)
      .where(gte(pageViewsTable.viewDate, since))
      .groupBy(pageViewsTable.path)
      .orderBy(desc(sql`sum(${pageViewsTable.count})`));

    const dailyRows = await db
      .select({
        path: pageViewsTable.path,
        viewDate: pageViewsTable.viewDate,
        count: pageViewsTable.count,
      })
      .from(pageViewsTable)
      .where(gte(pageViewsTable.viewDate, since))
      .orderBy(pageViewsTable.viewDate);

    res.status(200).json({
      sinceDate: since,
      days,
      totalsByPath,
      dailyRows,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to load page-view report");
    res.status(500).json({ error: "Failed to load page-view report" });
  }
});

const MAX_RETENTION_DAYS = 36500; // 100 years — sanity upper bound

// POST /admin/analytics/cleanup — trigger an immediate page-view cleanup.
// Protected by the shared admin token. An optional `retentionDays` query
// parameter overrides the default 730-day window for this single run.
router.post("/admin/analytics/cleanup", requireAdminToken, async (req, res): Promise<void> => {
  const raw = req.query.retentionDays;
  let retentionDays: number | undefined;

  if (raw !== undefined) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
      res.status(400).json({ error: "retentionDays must be a positive integer" });
      return;
    }
    retentionDays = Math.min(parsed, MAX_RETENTION_DAYS);
  }

  try {
    const deleted = await cleanupOldPageViews(retentionDays);
    res.status(200).json({ deleted, retentionDays: retentionDays ?? 730 });
  } catch (err) {
    req.log.error({ err }, "Admin-triggered page-view cleanup failed");
    res.status(500).json({ error: "Cleanup failed" });
  }
});

export default router;
