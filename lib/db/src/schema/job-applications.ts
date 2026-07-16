import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "interview",
  "offer",
  "hired",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const jobApplicationsTable = pgTable("job_applications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  /** FK to job_listings.id */
  jobListingId: text("job_listing_id").notNull(),
  /** Denormalized snapshot of the listing title at time of application. */
  jobListingTitle: text("job_listing_title").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  coverLetter: text("cover_letter").notNull(),
  resumeObjectPath: text("resume_object_path"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  availability: text("availability"),
  status: text("status").notNull().default("new"),
  staffNotes: text("staff_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplicationsTable).omit({
  id: true,
  status: true,
  staffNotes: true,
  createdAt: true,
  updatedAt: true,
});

export const updateJobApplicationSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  staffNotes: z.string().optional(),
});

export type JobApplicationRow = typeof jobApplicationsTable.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type UpdateJobApplication = z.infer<typeof updateJobApplicationSchema>;
