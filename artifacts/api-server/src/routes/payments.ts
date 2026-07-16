import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { getSquareClient, SQUARE_LOCATION_ID, moneyToNumber } from "../lib/square-client";

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
    const parsed = CreatePaymentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const { sourceId, amountCents, note, buyerEmailAddress } = parsed.data;

    try {
      const client = getSquareClient();
      const { result } = await client.paymentsApi.createPayment({
        sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: { amount: BigInt(amountCents), currency: "USD" },
        locationId: SQUARE_LOCATION_ID,
        ...(note ? { note } : {}),
        ...(buyerEmailAddress ? { buyerEmailAddress } : {}),
      });

      const p = result.payment;
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
// Used by the public marketplace cart checkout — orders appear in Square dashboard.

const LineItemSchema = z.object({
  /** Square catalog variation ID for the item. */
  catalogVariationId: z.string().min(1),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive(),
  /** Unit price in cents — used as a fallback if catalog lookup fails. */
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
    const parsed = CreateOrderAndPayBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const { lineItems, sourceId, buyerEmail } = parsed.data;

    try {
      const client = getSquareClient();

      // 1. Create a Square Order with catalog variation line items
      const orderRes = await client.ordersApi.createOrder({
        idempotencyKey: crypto.randomUUID(),
        order: {
          locationId: SQUARE_LOCATION_ID,
          lineItems: lineItems.map((item) => ({
            catalogObjectId: item.catalogVariationId,
            quantity: String(item.quantity),
            // Name is a fallback in case catalog lookup fails server-side
            name: item.name,
          })),
        },
      });

      const order = orderRes.result.order;
      if (!order?.id) {
        res.status(500).json({ error: "Failed to create order." });
        return;
      }

      const totalMoney = order.totalMoney;

      // 2. Charge the card against the order total
      const paymentRes = await client.paymentsApi.createPayment({
        sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
          amount: totalMoney?.amount ?? BigInt(lineItems.reduce((s, i) => s + i.basePriceCents * i.quantity, 0)),
          currency: "USD",
        },
        orderId: order.id,
        locationId: SQUARE_LOCATION_ID,
        ...(buyerEmail ? { buyerEmailAddress: buyerEmail } : {}),
      });

      const p = paymentRes.result.payment;
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
