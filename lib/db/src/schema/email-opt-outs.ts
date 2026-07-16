import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Records email addresses that have opted out of transactional
 * status-change emails. One row per unique email address.
 */
export const emailOptOutsTable = pgTable("email_opt_outs", {
  email: text("email").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type EmailOptOutRow = typeof emailOptOutsTable.$inferSelect;
