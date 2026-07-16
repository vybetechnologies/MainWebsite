import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, bookingRequestsTable, jobApplicationsTable } from "@workspace/db";
import { requireCustomerAuth } from "../lib/customer-auth";

const router: IRouter = Router();

// ── GET /api/account/repairs ──────────────────────────────────────────────────
// Requires a valid Clerk JWT. Email is derived from the verified identity —
// never from the query string — so a user can only see their own repairs.

router.get(
  "/account/repairs",
  requireCustomerAuth,
  async (req: Request, res: Response): Promise<void> => {
    const email = req.customerEmail!; // set by requireCustomerAuth

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
  },
);

// ── GET /api/account/applications ────────────────────────────────────────────
// Requires a valid Clerk JWT. Email is derived from the verified identity.

router.get(
  "/account/applications",
  requireCustomerAuth,
  async (req: Request, res: Response): Promise<void> => {
    const email = req.customerEmail!; // set by requireCustomerAuth

    try {
      const rows = await db
        .select({
          id: jobApplicationsTable.id,
          jobListingTitle: jobApplicationsTable.jobListingTitle,
          status: jobApplicationsTable.status,
          firstName: jobApplicationsTable.firstName,
          lastName: jobApplicationsTable.lastName,
          createdAt: jobApplicationsTable.createdAt,
          // Intentionally omitting: staffNotes, resumeObjectPath, coverLetter
        })
        .from(jobApplicationsTable)
        .where(eq(jobApplicationsTable.email, email));

      res.status(200).json({ applications: rows });
    } catch (err) {
      req.log.error({ err }, "Failed to load account applications");
      res.status(500).json({ error: "Failed to load applications." });
    }
  },
);

export default router;
