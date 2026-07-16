import { Router, type IRouter, type Request, type Response } from "express";
import { getSquareClient, moneyToNumber } from "../lib/square-client";

const router: IRouter = Router();

/**
 * GET /api/catalog/items
 * Returns all active ITEM-type catalog entries from Square.
 * Public — no auth required (read-only product listings).
 * Amounts returned in cents.
 */
router.get("/catalog/items", async (req: Request, res: Response): Promise<void> => {
  try {
    const client = getSquareClient();
    const { result } = await client.catalogApi.listCatalog(undefined, "ITEM");

    const items = (result.objects ?? [])
      .filter((obj) => obj.isDeleted !== true)
      .map((obj) => ({
        id: obj.id,
        name: obj.itemData?.name ?? "",
        description: obj.itemData?.description ?? "",
        imageIds: obj.itemData?.imageIds ?? [],
        variations: (obj.itemData?.variations ?? [])
          .filter((v) => v.isDeleted !== true)
          .map((v) => ({
            id: v.id,
            name: v.itemVariationData?.name ?? "Regular",
            priceCents: moneyToNumber(v.itemVariationData?.priceMoney?.amount),
            sku: v.itemVariationData?.sku ?? null,
          })),
      }));

    res.json({ items });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch Square catalog");
    res.status(500).json({ error: "Could not load catalog." });
  }
});

export default router;
