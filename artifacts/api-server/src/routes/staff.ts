import { Router, type IRouter } from "express";
import { sql, gte, desc, eq } from "drizzle-orm";
import {
  db,
  pageViewsTable,
  jobListingsTable,
  insertJobListingSchema,
  updateJobListingSchema,
} from "@workspace/db";
import { requireStaffAuth } from "../lib/staff-auth";

const router: IRouter = Router();

const MAX_REPORT_DAYS = 90;
const DEFAULT_REPORT_DAYS = 30;

function daysAgoIsoDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

// ── Public: list active job listings ─────────────────────────────────────────

router.get("/job-listings", async (req, res): Promise<void> => {
  try {
    const listings = await db
      .select()
      .from(jobListingsTable)
      .where(eq(jobListingsTable.isActive, true))
      .orderBy(desc(jobListingsTable.createdAt));
    res.status(200).json({ listings });
  } catch (err) {
    req.log.error({ err }, "Failed to load job listings");
    res.status(500).json({ error: "Failed to load job listings" });
  }
});

// ── Staff: list all job listings (active + inactive) ─────────────────────────

router.get("/staff/job-listings", requireStaffAuth, async (req, res): Promise<void> => {
  try {
    const listings = await db
      .select()
      .from(jobListingsTable)
      .orderBy(desc(jobListingsTable.createdAt));
    res.status(200).json({ listings });
  } catch (err) {
    req.log.error({ err }, "Failed to load staff job listings");
    res.status(500).json({ error: "Failed to load job listings" });
  }
});

// ── Staff: create a job listing ───────────────────────────────────────────────

router.post("/staff/job-listings", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = insertJobListingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [listing] = await db
      .insert(jobListingsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({ listing });
  } catch (err) {
    req.log.error({ err }, "Failed to create job listing");
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// ── Staff: update a job listing ───────────────────────────────────────────────

router.patch("/staff/job-listings/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const { id } = req.params;
  const parsed = updateJobListingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [listing] = await db
      .update(jobListingsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(jobListingsTable.id, id))
      .returning();
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.status(200).json({ listing });
  } catch (err) {
    req.log.error({ err }, "Failed to update job listing");
    res.status(500).json({ error: "Failed to update listing" });
  }
});

// ── Staff: delete a job listing ───────────────────────────────────────────────

router.delete("/staff/job-listings/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const { id } = req.params;
  try {
    const [deleted] = await db
      .delete(jobListingsTable)
      .where(eq(jobListingsTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete job listing");
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

// ── Staff: page-view analytics ────────────────────────────────────────────────

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
