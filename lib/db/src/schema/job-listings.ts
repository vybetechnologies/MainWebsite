import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobListingsTable = pgTable("job_listings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull().default("Fargo, ND"),
  type: text("type").notNull().default("Full-time"),
  description: text("description").notNull(),
  requirements: text("requirements"),
  salaryRange: text("salary_range"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertJobListingSchema = createInsertSchema(jobListingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateJobListingSchema = insertJobListingSchema.partial();

export const selectJobListingSchema = createSelectSchema(jobListingsTable);

export type JobListingRow = typeof jobListingsTable.$inferSelect;
export type InsertJobListing = z.infer<typeof insertJobListingSchema>;
export type UpdateJobListing = z.infer<typeof updateJobListingSchema>;
