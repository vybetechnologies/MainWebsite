import { Router, type IRouter } from "express";
import { sql, gte, desc } from "drizzle-orm";
import { db, pageViewsTable } from "@workspace/db";
import { requireStaffAuth } from "../lib/staff-auth";

const router: IRouter = Router();

const MAX_REPORT_DAYS = 90;
const DEFAULT_REPORT_DAYS = 30;

function daysAgoIsoDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

/**
 * GET /staff/analytics — Clerk-session-protected analytics for the staff dashboard.
 * Returns page-view totals by path and daily row data for charting.
 * ?days=N  Number of days to look back (default 30, max 90).
 */
router.get("/staff/analytics", requireStaffAuth, async (req, res): Promise<void> => {
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

    res.status(200).json({ sinceDate: since, days, totalsByPath, dailyRows });
  } catch (err) {
    req.log.error({ err }, "Failed to load staff analytics");
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

export default router;
