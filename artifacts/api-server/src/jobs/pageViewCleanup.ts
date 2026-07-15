import { sql } from "drizzle-orm";
import { db, pageViewsTable } from "@workspace/db";
import { logger } from "../lib/logger";

/**
 * Retention window: keep 2 years of page-view data. Rows older than this are
 * deleted in a single DELETE … WHERE view_date < (today - retention).
 */
const RETENTION_DAYS = 730;

export async function cleanupOldPageViews(): Promise<void> {
  try {
    const result = await db
      .delete(pageViewsTable)
      .where(
        sql`${pageViewsTable.viewDate} < (current_date - ${RETENTION_DAYS}::int)`,
      );
    // result.rowCount is only available on the underlying pg Result; drizzle
    // returns it as rowCount on the QueryResult for pg driver.
    const deleted = (result as unknown as { rowCount?: number }).rowCount ?? 0;
    logger.info({ deleted, retentionDays: RETENTION_DAYS }, "Page-view cleanup complete");
  } catch (err) {
    logger.error({ err }, "Page-view cleanup failed");
  }
}

const ONE_DAY_MS = 24 * 60 * 60 * 1_000;

/**
 * Start the recurring cleanup job. Runs once immediately after the server
 * starts (to clear any backlog), then once every 24 hours.
 */
export function startPageViewCleanupJob(): void {
  // Run immediately on startup, then on a daily interval.
  void cleanupOldPageViews();
  setInterval(() => void cleanupOldPageViews(), ONE_DAY_MS).unref();
  logger.info({ retentionDays: RETENTION_DAYS }, "Page-view cleanup job scheduled (daily)");
}
