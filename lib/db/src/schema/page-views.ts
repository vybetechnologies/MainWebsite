import { pgTable, text, date, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Minimal, privacy-respecting aggregate page-view counter. Stores only a
 * route path and a per-day count — no cookies, no IP addresses, no visitor
 * identifiers of any kind. One row per (path, date).
 */
export const pageViewsTable = pgTable(
  "page_views",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    path: text("path").notNull(),
    viewDate: date("view_date").notNull(),
    count: integer("count").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("page_views_path_date_idx").on(table.path, table.viewDate)],
);

export type PageView = typeof pageViewsTable.$inferSelect;
