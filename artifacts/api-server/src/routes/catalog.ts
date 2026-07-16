import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc } from "drizzle-orm";
import { db, marketplaceItemsTable } from "@workspace/db";
import { z } from "zod";
import type { CatalogObject } from "square";
import { getSquareClient, moneyToNumber } from "../lib/square-client";
import { requireStaffAuth } from "../lib/staff-auth";

const router: IRouter = Router();

// ── Shared Square fetch ───────────────────────────────────────────────────────

interface SquareCatalogItem {
  id: string;
  name: string;
  description: string;
  imageIds: string[];
  categoryName: string | null;
  variations: {
    id: string;
    name: string;
    priceCents: number;
    sku: string | null;
  }[];
  isDeleted: boolean;
}

async function fetchSquareCatalogItems(): Promise<SquareCatalogItem[]> {
  const client = getSquareClient();

  // Paginate through all catalog items + categories
  const objects: CatalogObject[] = [];
  const page = await client.catalog.list({ types: "ITEM,CATEGORY" });
  for await (const obj of page) {
    objects.push(obj);
  }

  // Build category name map
  const categoryMap = new Map<string, string>();
  for (const obj of objects) {
    if (obj.type === "CATEGORY" && obj.id && obj.categoryData?.name) {
      categoryMap.set(obj.id, obj.categoryData.name);
    }
  }

  return objects
    .filter((obj) => obj.type === "ITEM")
    .map((obj) => {
      const catId = obj.itemData?.categoryId ?? obj.itemData?.categories?.[0]?.id;
      return {
        id: obj.id!,
        name: obj.itemData?.name ?? "",
        description: obj.itemData?.description ?? "",
        imageIds: obj.itemData?.imageIds ?? [],
        categoryName: catId ? (categoryMap.get(catId) ?? null) : null,
        variations: (obj.itemData?.variations ?? [])
          .filter((v): v is CatalogObject.ItemVariation =>
            v.type === "ITEM_VARIATION" && v.isDeleted !== true)
          .map((v) => ({
            id: v.id!,
            name: v.itemVariationData?.name ?? "Regular",
            priceCents: moneyToNumber(v.itemVariationData?.priceMoney?.amount),
            sku: v.itemVariationData?.sku ?? null,
          })),
        isDeleted: obj.isDeleted === true,
      };
    });
}

// ── GET /api/catalog/items — public ──────────────────────────────────────────
// Returns only staff-approved (visible=true) items, sorted by display_order.

router.get(
  "/catalog/items",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch visibility state from DB
      const visibleRows = await db
        .select()
        .from(marketplaceItemsTable)
        .where(eq(marketplaceItemsTable.visible, true))
        .orderBy(asc(marketplaceItemsTable.displayOrder));

      if (visibleRows.length === 0) {
        res.json({ items: [] });
        return;
      }

      const visibleSet = new Map(
        visibleRows.map((r) => [r.squareItemId, r.displayOrder]),
      );

      const squareItems = await fetchSquareCatalogItems();

      const items = squareItems
        .filter(
          (item) => !item.isDeleted && visibleSet.has(item.id),
        )
        .sort(
          (a, b) =>
            (visibleSet.get(a.id) ?? 0) - (visibleSet.get(b.id) ?? 0),
        )
        .map(({ isDeleted: _d, ...rest }) => rest);

      res.json({ items });
    } catch (err) {
      req.log.error({ err }, "Failed to fetch Square catalog");
      res.status(500).json({ error: "Could not load catalog." });
    }
  },
);

// ── GET /api/staff/catalog — staff ────────────────────────────────────────────
// Returns every Square catalog item merged with DB visibility state.

router.get(
  "/staff/catalog",
  requireStaffAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const [squareItems, dbRows] = await Promise.all([
        fetchSquareCatalogItems(),
        db
          .select()
          .from(marketplaceItemsTable)
          .orderBy(asc(marketplaceItemsTable.displayOrder)),
      ]);

      const dbMap = new Map(dbRows.map((r) => [r.squareItemId, r]));

      const items = squareItems.map((item, idx) => {
        const row = dbMap.get(item.id);
        return {
          ...item,
          visible: row?.visible ?? false,
          displayOrder: row?.displayOrder ?? idx,
        };
      });

      // Sort: DB-ordered first, then unseen items at the end
      items.sort((a, b) => {
        const aInDb = dbMap.has(a.id);
        const bInDb = dbMap.has(b.id);
        if (aInDb && bInDb) return a.displayOrder - b.displayOrder;
        if (aInDb) return -1;
        if (bInDb) return 1;
        return a.name.localeCompare(b.name);
      });

      res.json({ items });
    } catch (err) {
      req.log.error({ err }, "Failed to fetch staff catalog");
      res.status(500).json({ error: "Could not load catalog." });
    }
  },
);

// ── PATCH /api/staff/catalog/:id — staff ─────────────────────────────────────
// Upserts visibility + display order for a catalog item.

const PatchCatalogBody = z.object({
  visible: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

router.patch(
  "/staff/catalog/:id",
  requireStaffAuth,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = PatchCatalogBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const squareItemId = req.params.id as string;
    const { visible, displayOrder } = parsed.data;

    try {
      const now = new Date();
      const setValues: {
        visible?: boolean;
        displayOrder?: number;
        updatedAt: Date;
      } = { updatedAt: now };
      if (visible !== undefined) setValues.visible = visible;
      if (displayOrder !== undefined) setValues.displayOrder = displayOrder;

      await db
        .insert(marketplaceItemsTable)
        .values({
          squareItemId,
          visible: visible ?? false,
          displayOrder: displayOrder ?? 0,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: marketplaceItemsTable.squareItemId,
          set: setValues,
        });

      res.json({ ok: true });
    } catch (err) {
      req.log.error({ err }, "Failed to update catalog item visibility");
      res.status(500).json({ error: "Could not update item." });
    }
  },
);

export default router;
