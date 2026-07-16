import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { inArray } from "drizzle-orm";
import { db, marketplaceItemsTable } from "@workspace/db";
import { getSquareClient, isSquareAvailable, SQUARE_LOCATION_ID, moneyToNumber } from "../lib/square-client";

const router: IRouter = Router();

// ── POST /api/payments/create-payment ─────────────────────────────────────────
// Simple one-off payment (deposits, ad-hoc charges). Used by booking deposit.

const CreatePaymentBody = z.object({
  sourceId: z.string().min(1),
  amountCents: z.number().int().positive(),
  note: z.string().max(500).optional(),
  buyerEmailAddress: z.string().email().optional(),
});

router.post(
  "/payments/create-payment",
  async (req: Request, res: Response): Promise<void> => {
    if (!isSquareAvailable()) {
      res.status(503).json({ error: "Payment processing is temporarily unavailable. Please try again later." });
      return;
    }

    const parsed = CreatePaymentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const { sourceId, amountCents, note, buyerEmailAddress } = parsed.data;

    try {
      const client = getSquareClient();
      const paymentRes = await client.payments.create({
        sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: { amount: BigInt(amountCents), currency: "USD" },
        locationId: SQUARE_LOCATION_ID,
        ...(note ? { note } : {}),
        ...(buyerEmailAddress ? { buyerEmailAddress } : {}),
      });

      const p = paymentRes.payment;
      res.status(200).json({
        paymentId: p?.id,
        status: p?.status,
        receiptUrl: p?.receiptUrl,
        totalMoney: moneyToNumber(p?.totalMoney?.amount),
      });
    } catch (err: unknown) {
      req.log.error({ err }, "Square payment failed");
      const errors = (err as { errors?: { detail?: string }[] }).errors;
      const detail = errors?.[0]?.detail ?? "Payment could not be processed.";
      res.status(402).json({ error: detail });
    }
  },
);

// ── POST /api/payments/create-order-and-pay ───────────────────────────────────
// Creates a Square Order (with named line items) then charges it.
// Only allows variations whose parent Square item is staff-approved (visible=true).

const LineItemSchema = z.object({
  catalogVariationId: z.string().min(1),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive(),
  basePriceCents: z.number().int().min(0),
});

const CreateOrderAndPayBody = z.object({
  lineItems: z.array(LineItemSchema).min(1),
  sourceId: z.string().min(1),
  buyerEmail: z.string().email().optional(),
});

router.post(
  "/payments/create-order-and-pay",
  async (req: Request, res: Response): Promise<void> => {
    if (!isSquareAvailable()) {
      res.status(503).json({ error: "Payment processing is temporarily unavailable. Please try again later." });
      return;
    }

    const parsed = CreateOrderAndPayBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const { lineItems, sourceId, buyerEmail } = parsed.data;

    try {
      const client = getSquareClient();

      // ── Step 0: Validate every variation is from a staff-approved item ──────
      const variationIds = lineItems.map((li) => li.catalogVariationId);

      // Batch-fetch the variation objects to get their parent Square item IDs
      const batchRes = await client.catalog.batchGet({
        objectIds: variationIds,
        includeRelatedObjects: false,
      });

      const fetchedObjects = batchRes.objects ?? [];

      // Build a map: variationId → parentItemId
      // Narrow to ITEM_VARIATION so TypeScript can access itemVariationData
      const variationToItemId = new Map<string, string>();
      for (const obj of fetchedObjects) {
        if (obj.type === "ITEM_VARIATION" && obj.id && obj.itemVariationData?.itemId) {
          variationToItemId.set(obj.id, obj.itemVariationData.itemId);
        }
      }

      // Ensure every requested variation was found
      const missingVariations = variationIds.filter((id) => !variationToItemId.has(id));
      if (missingVariations.length > 0) {
        res.status(400).json({ error: "One or more items could not be found in the catalog." });
        return;
      }

      // Collect unique parent item IDs
      const parentItemIds = [...new Set(variationToItemId.values())];

      // Check visibility for each parent item — all must be visible=true
      const visibleRows = await db
        .select({
          squareItemId: marketplaceItemsTable.squareItemId,
          visible: marketplaceItemsTable.visible,
        })
        .from(marketplaceItemsTable)
        .where(inArray(marketplaceItemsTable.squareItemId, parentItemIds));

      const visibleSet = new Set(
        visibleRows.filter((r) => r.visible).map((r) => r.squareItemId),
      );

      const blockedItems = parentItemIds.filter((id) => !visibleSet.has(id));
      if (blockedItems.length > 0) {
        req.log.warn({ blockedItems }, "Checkout blocked: items not in approved marketplace");
        res.status(403).json({
          error: "One or more items in your cart are not available for purchase.",
        });
        return;
      }

      // ── Step 1: Create a Square Order ────────────────────────────────────────
      const orderRes = await client.orders.create({
        idempotencyKey: crypto.randomUUID(),
        order: {
          locationId: SQUARE_LOCATION_ID,
          lineItems: lineItems.map((item) => ({
            catalogObjectId: item.catalogVariationId,
            quantity: String(item.quantity),
            name: item.name,
          })),
        },
      });

      const order = orderRes.order;
      if (!order?.id) {
        res.status(500).json({ error: "Failed to create order." });
        return;
      }

      // ── Step 2: Charge the card against the order total ───────────────────
      const totalMoney = order.totalMoney;
      const fallbackCents = lineItems.reduce(
        (s, i) => s + i.basePriceCents * i.quantity,
        0,
      );

      const paymentRes = await client.payments.create({
        sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
          amount: totalMoney?.amount ?? BigInt(fallbackCents),
          currency: "USD",
        },
        orderId: order.id,
        locationId: SQUARE_LOCATION_ID,
        ...(buyerEmail ? { buyerEmailAddress: buyerEmail } : {}),
      });

      const p = paymentRes.payment;
      res.status(200).json({
        orderId: order.id,
        paymentId: p?.id,
        status: p?.status,
        receiptUrl: p?.receiptUrl,
        totalMoney: moneyToNumber(totalMoney?.amount),
      });
    } catch (err: unknown) {
      req.log.error({ err }, "Square order-and-pay failed");
      const errors = (err as { errors?: { detail?: string }[] }).errors;
      const detail = errors?.[0]?.detail ?? "Payment could not be processed.";
      res.status(402).json({ error: detail });
    }
  },
);

export default router;
