/**
 * Integration tests for the analytics page-view routes.
 *
 * Tests exercise the real Neon database so the upsert conflict resolution and
 * aggregation queries are validated against actual SQL — not mocks.
 *
 * A unique path prefix is used for every test run so parallel/repeated runs
 * don't interfere with each other or with production data.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq, inArray, sql, gte } from "drizzle-orm";
import { db, pageViewsTable } from "@workspace/db";

// Unique namespace for all rows created by this test run.
const TEST_PREFIX = `/__test__/analytics-${crypto.randomUUID()}/`;

/** ISO date string for today (UTC). */
function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** ISO date string for `days` days ago (UTC). */
function daysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

// IDs of every row we insert so afterAll can clean up unconditionally.
const insertedIds: string[] = [];

/** Helper: upsert a page view exactly as the POST /analytics/pageview route does. */
async function recordPageView(path: string, viewDate: string): Promise<void> {
  await db
    .insert(pageViewsTable)
    .values({ path, viewDate, count: 1 })
    .onConflictDoUpdate({
      target: [pageViewsTable.path, pageViewsTable.viewDate],
      set: {
        count: sql`${pageViewsTable.count} + 1`,
        updatedAt: new Date(),
      },
    });
}

/** Helper: read the current count for (path, viewDate) from the DB. */
async function getCount(path: string, viewDate: string): Promise<number | null> {
  const rows = await db
    .select({ count: pageViewsTable.count, id: pageViewsTable.id })
    .from(pageViewsTable)
    .where(
      sql`${pageViewsTable.path} = ${path} AND ${pageViewsTable.viewDate} = ${viewDate}`
    );
  if (rows.length === 0) return null;
  // Track IDs for cleanup.
  for (const r of rows) {
    if (!insertedIds.includes(r.id)) insertedIds.push(r.id);
  }
  return rows[0].count;
}

afterAll(async () => {
  // Remove every row seeded or created by this test run.
  if (insertedIds.length > 0) {
    await db
      .delete(pageViewsTable)
      .where(inArray(pageViewsTable.id, insertedIds));
  }
  // Belt-and-suspenders: also delete by prefix in case any row slipped through.
  await db
    .delete(pageViewsTable)
    .where(sql`${pageViewsTable.path} LIKE ${TEST_PREFIX + "%"}`);
});

// ---------------------------------------------------------------------------
// Upsert / count-increment tests
// ---------------------------------------------------------------------------

describe("POST /analytics/pageview — upsert logic", () => {
  it("inserts a new row with count=1 on the first visit", async () => {
    const path = `${TEST_PREFIX}home`;
    const today = todayIsoDate();

    await recordPageView(path, today);

    const count = await getCount(path, today);
    expect(count).toBe(1);
  });

  it("increments count on repeated visits to the same path on the same day", async () => {
    const path = `${TEST_PREFIX}about`;
    const today = todayIsoDate();

    await recordPageView(path, today);
    await recordPageView(path, today);
    await recordPageView(path, today);

    const count = await getCount(path, today);
    expect(count).toBe(3);
  });

  it("keeps separate rows for the same path on different days", async () => {
    const path = `${TEST_PREFIX}services`;
    const today = todayIsoDate();
    const yesterday = daysAgo(1);

    await recordPageView(path, today);
    await recordPageView(path, today);
    await recordPageView(path, yesterday);

    const todayCount = await getCount(path, today);
    const yesterdayCount = await getCount(path, yesterday);

    expect(todayCount).toBe(2);
    expect(yesterdayCount).toBe(1);
  });

  it("keeps separate rows for different paths on the same day", async () => {
    const today = todayIsoDate();
    const pathA = `${TEST_PREFIX}page-a`;
    const pathB = `${TEST_PREFIX}page-b`;

    await recordPageView(pathA, today);
    await recordPageView(pathA, today);
    await recordPageView(pathB, today);

    const countA = await getCount(pathA, today);
    const countB = await getCount(pathB, today);

    expect(countA).toBe(2);
    expect(countB).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Analytics read / aggregation tests
// ---------------------------------------------------------------------------

describe("GET /analytics/pageviews — aggregation query", () => {
  const PATH_POPULAR = `${TEST_PREFIX}popular`;
  const PATH_QUIET = `${TEST_PREFIX}quiet`;

  /** Seed rows directly (bypassing the rate-limiter) before the read tests. */
  beforeAll(async () => {
    // PATH_POPULAR: 10 views today + 5 views yesterday = 15 total
    const rows = [
      { path: PATH_POPULAR, viewDate: todayIsoDate(), count: 10 },
      { path: PATH_POPULAR, viewDate: daysAgo(1), count: 5 },
      // PATH_QUIET: 2 views today = 2 total
      { path: PATH_QUIET, viewDate: todayIsoDate(), count: 2 },
    ];

    const inserted = await db
      .insert(pageViewsTable)
      .values(rows)
      .returning({ id: pageViewsTable.id });

    insertedIds.push(...inserted.map((r) => r.id));
  });

  it("sums per-day counts into a totalViews per path", async () => {
    // Mirror the aggregation query from the route.
    const since = daysAgo(30);
    const results = await db
      .select({
        path: pageViewsTable.path,
        totalViews: sql<number>`sum(${pageViewsTable.count})`.mapWith(Number),
      })
      .from(pageViewsTable)
      .where(
        sql`${pageViewsTable.path} LIKE ${TEST_PREFIX + "%"} AND ${pageViewsTable.viewDate} >= ${since}`
      )
      .groupBy(pageViewsTable.path)
      .orderBy(sql`sum(${pageViewsTable.count}) DESC`);

    const byPath = Object.fromEntries(results.map((r) => [r.path, r.totalViews]));

    // PATH_POPULAR has 10 + 5 = 15 total views.
    expect(byPath[PATH_POPULAR]).toBe(15);
    // PATH_QUIET has 2 total views.
    expect(byPath[PATH_QUIET]).toBe(2);
  });

  it("orders results by total views descending", async () => {
    const since = daysAgo(30);
    const results = await db
      .select({
        path: pageViewsTable.path,
        totalViews: sql<number>`sum(${pageViewsTable.count})`.mapWith(Number),
      })
      .from(pageViewsTable)
      .where(
        sql`${pageViewsTable.path} LIKE ${TEST_PREFIX + "%"} AND ${pageViewsTable.viewDate} >= ${since}`
      )
      .groupBy(pageViewsTable.path)
      .orderBy(sql`sum(${pageViewsTable.count}) DESC`);

    // The most-viewed path should come first.
    expect(results[0].path).toBe(PATH_POPULAR);
    expect(results[0].totalViews).toBeGreaterThan(results[1].totalViews);
  });

  it("returns daily rows for the date range", async () => {
    const since = daysAgo(30);
    const dailyRows = await db
      .select({
        path: pageViewsTable.path,
        viewDate: pageViewsTable.viewDate,
        count: pageViewsTable.count,
      })
      .from(pageViewsTable)
      .where(
        sql`${pageViewsTable.path} LIKE ${TEST_PREFIX + "%"} AND ${pageViewsTable.viewDate} >= ${since}`
      )
      .orderBy(pageViewsTable.viewDate);

    // Should contain individual daily rows, not just aggregates.
    const popularRows = dailyRows.filter((r) => r.path === PATH_POPULAR);
    expect(popularRows.length).toBe(2); // one for today, one for yesterday
    expect(popularRows.map((r) => r.count).sort((a, b) => a - b)).toEqual([5, 10]);
  });

  it("excludes rows outside the requested date window", async () => {
    // Seed a row from 45 days ago — outside a 30-day window.
    const oldDate = daysAgo(45);
    const PATH_OLD = `${TEST_PREFIX}old-page`;

    const inserted = await db
      .insert(pageViewsTable)
      .values({ path: PATH_OLD, viewDate: oldDate, count: 99 })
      .returning({ id: pageViewsTable.id });

    insertedIds.push(...inserted.map((r) => r.id));

    const since = daysAgo(30);
    const results = await db
      .select({
        path: pageViewsTable.path,
        totalViews: sql<number>`sum(${pageViewsTable.count})`.mapWith(Number),
      })
      .from(pageViewsTable)
      .where(
        sql`${pageViewsTable.path} LIKE ${TEST_PREFIX + "%"} AND ${pageViewsTable.viewDate} >= ${since}`
      )
      .groupBy(pageViewsTable.path);

    const paths = results.map((r) => r.path);
    expect(paths).not.toContain(PATH_OLD);
  });
});
