import { Router, type IRouter } from "express";
import { desc, eq, and } from "drizzle-orm";
import {
  db,
  jobApplicationsTable,
  jobListingsTable,
  insertJobApplicationSchema,
  updateJobApplicationSchema,
} from "@workspace/db";
import { requireStaffAuth } from "../lib/staff-auth";

const router: IRouter = Router();

// ── Public: submit an application ─────────────────────────────────────────────

router.post("/applications", async (req, res): Promise<void> => {
  // Resolve the listing first so we can snapshot the title and verify it exists & is active.
  const listingId = req.body?.jobListingId as string | undefined;
  if (!listingId) {
    res.status(400).json({ error: "jobListingId is required" });
    return;
  }

  const [listing] = await db
    .select({ id: jobListingsTable.id, title: jobListingsTable.title, isActive: jobListingsTable.isActive })
    .from(jobListingsTable)
    .where(eq(jobListingsTable.id, listingId))
    .limit(1);

  if (!listing) {
    res.status(404).json({ error: "Job listing not found" });
    return;
  }
  if (!listing.isActive) {
    res.status(410).json({ error: "This position is no longer accepting applications" });
    return;
  }

  const parsed = insertJobApplicationSchema.safeParse({
    ...req.body,
    jobListingTitle: listing.title,
  });

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [application] = await db
      .insert(jobApplicationsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({ application });
  } catch (err) {
    req.log.error({ err }, "Failed to save application");
    res.status(500).json({ error: "Failed to save application" });
  }
});

// ── Staff: list applications ───────────────────────────────────────────────────

router.get("/staff/applications", requireStaffAuth, async (req, res): Promise<void> => {
  try {
    const conditions = [];
    if (req.query.jobId) {
      conditions.push(eq(jobApplicationsTable.jobListingId, String(req.query.jobId)));
    }
    if (req.query.status) {
      conditions.push(eq(jobApplicationsTable.status, String(req.query.status)));
    }

    const applications = await db
      .select()
      .from(jobApplicationsTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(jobApplicationsTable.createdAt));

    res.status(200).json({ applications });
  } catch (err) {
    req.log.error({ err }, "Failed to list applications");
    res.status(500).json({ error: "Failed to load applications" });
  }
});

// ── Staff: update status / notes ──────────────────────────────────────────────

router.patch("/staff/applications/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const { id } = req.params;
  const parsed = updateJobApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [application] = await db
      .update(jobApplicationsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(jobApplicationsTable.id, id))
      .returning();

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.status(200).json({ application });
  } catch (err) {
    req.log.error({ err }, "Failed to update application");
    res.status(500).json({ error: "Failed to update application" });
  }
});

export default router;
