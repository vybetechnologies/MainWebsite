/**
 * Integration test for cleanupOldPageViews().
 *
 * Seeds `page_views` with stale rows (> 730 days old) and recent rows, then
 * calls the cleanup function and asserts that only the recent rows survive.
 *
 * Uses a unique path prefix per test run so parallel or repeated runs don't
 * interfere with each other or with real production data.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq, inArray, sql } from "drizzle-orm";
import { db, pageViewsTable } from "@workspace/db";
import { cleanupOldPageViews } from "./pageViewCleanup";

// A unique namespace for rows created by this test run.
const TEST_PREFIX = `/__test__/pvc-${crypto.randomUUID()}/`;

/** Build a view_date string that is `daysAgo` days before today. */
function daysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// IDs of every row we insert so we can clean up regardless of test outcome.
const insertedIds: string[] = [];

beforeAll(async () => {
  const rows = [
    // Stale rows — older than the 730-day retention window.
    { path: `${TEST_PREFIX}old-1`, viewDate: daysAgo(731), count: 5 },
    { path: `${TEST_PREFIX}old-2`, viewDate: daysAgo(1000), count: 12 },
    { path: `${TEST_PREFIX}old-3`, viewDate: daysAgo(800), count: 1 },
    // Recent rows — within the retention window; must survive cleanup.
    { path: `${TEST_PREFIX}recent-1`, viewDate: daysAgo(0), count: 3 },
    { path: `${TEST_PREFIX}recent-2`, viewDate: daysAgo(365), count: 7 },
    { path: `${TEST_PREFIX}recent-3`, viewDate: daysAgo(729), count: 2 },
  ];

  const inserted = await db
    .insert(pageViewsTable)
    .values(rows)
    .returning({ id: pageViewsTable.id });

  insertedIds.push(...inserted.map((r) => r.id));
});

afterAll(async () => {
  // Clean up any leftover test rows (covers both passing and failing tests).
  if (insertedIds.length > 0) {
    await db
      .delete(pageViewsTable)
      .where(inArray(pageViewsTable.id, insertedIds));
  }
});

describe("cleanupOldPageViews", () => {
  it("deletes rows older than 730 days and keeps rows within the retention window", async () => {
    await cleanupOldPageViews();

    // Fetch surviving rows that belong to this test run.
    const surviving = await db
      .select({ path: pageViewsTable.path })
      .from(pageViewsTable)
      .where(
        sql`${pageViewsTable.path} LIKE ${TEST_PREFIX + "%"}`
      );

    const survivingPaths = surviving.map((r) => r.path);

    // Stale rows must be gone.
    expect(survivingPaths).not.toContain(`${TEST_PREFIX}old-1`);
    expect(survivingPaths).not.toContain(`${TEST_PREFIX}old-2`);
    expect(survivingPaths).not.toContain(`${TEST_PREFIX}old-3`);

    // Recent rows must still be present.
    expect(survivingPaths).toContain(`${TEST_PREFIX}recent-1`);
    expect(survivingPaths).toContain(`${TEST_PREFIX}recent-2`);
    expect(survivingPaths).toContain(`${TEST_PREFIX}recent-3`);
  });
});
