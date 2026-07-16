import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { getSquareClient, SQUARE_LOCATION_ID, moneyToNumber } from "../lib/square-client";

const router: IRouter = Router();

const CreatePaymentBody = z.object({
  /** Square Web Payments SDK payment token (sourceId). */
  sourceId: z.string().min(1),
  /** Amount in US cents (e.g. 5000 = $50.00). */
  amountCents: z.number().int().positive(),
  /** Human-readable label on the Square receipt. */
  note: z.string().max(500).optional(),
  /** Customer email for the receipt — optional but recommended. */
  buyerEmailAddress: z.string().email().optional(),
});

/**
 * POST /api/payments/create-payment
 * Accepts a Square payment token from the Web Payments SDK and charges the card.
 * Used by both cart checkout and booking deposit flows.
 */
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
        amountMoney: {
          amount: BigInt(amountCents),
          currency: "USD",
        },
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

export default router;
