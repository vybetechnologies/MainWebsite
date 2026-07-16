import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { getSquareClient, SQUARE_LOCATION_ID, moneyToNumber } from "../lib/square-client";
import { requireStaffAuth } from "../lib/staff-auth";

const router: IRouter = Router();

const LineItemSchema = z.object({
  name: z.string().min(1).max(200),
  amountCents: z.number().int().positive(),
  qty: z.number().int().positive().default(1),
});

const CreateInvoiceBody = z.object({
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email(),
  lineItems: z.array(LineItemSchema).min(1),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  note: z.string().max(1000).optional(),
});

// ── GET /api/staff/invoices ───────────────────────────────────────────────────

router.get(
  "/staff/invoices",
  requireStaffAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const client = getSquareClient();

      // Collect all pages of invoices
      const allInvoices: import("square").Invoice[] = [];
      const page = await client.invoices.list({ locationId: SQUARE_LOCATION_ID });
      for await (const inv of page) {
        allInvoices.push(inv);
      }

      const invoices = allInvoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        status: inv.status,
        publicUrl: inv.publicUrl,
        dueDate: inv.paymentRequests?.[0]?.dueDate ?? null,
        recipientEmail: inv.primaryRecipient?.emailAddress ?? null,
        totalCents: moneyToNumber(
          inv.paymentRequests?.[0]?.totalCompletedAmountMoney?.amount ??
          inv.paymentRequests?.[0]?.computedAmountMoney?.amount,
        ),
        createdAt: inv.createdAt ?? null,
      }));

      res.json({ invoices });
    } catch (err) {
      req.log.error({ err }, "Failed to list Square invoices");
      res.status(500).json({ error: "Could not load invoices." });
    }
  },
);

// ── POST /api/staff/invoices ──────────────────────────────────────────────────

router.post(
  "/staff/invoices",
  requireStaffAuth,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = CreateInvoiceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const { customerName, customerEmail, lineItems, dueDate, note } = parsed.data;

    try {
      const client = getSquareClient();

      // 1. Find or create the customer in Square
      let customerId: string;
      const searchRes = await client.customers.search({
        query: { filter: { emailAddress: { exact: customerEmail } } },
      });

      if (searchRes.customers?.length) {
        customerId = searchRes.customers[0].id!;
      } else {
        const nameParts = customerName.trim().split(/\s+/);
        const givenName = nameParts[0];
        const familyName = nameParts.slice(1).join(" ") || undefined;
        const createRes = await client.customers.create({
          givenName,
          ...(familyName ? { familyName } : {}),
          emailAddress: customerEmail,
          idempotencyKey: crypto.randomUUID(),
        });
        customerId = createRes.customer!.id!;
      }

      // 2. Create a Square Order with line items
      const orderRes = await client.orders.create({
        idempotencyKey: crypto.randomUUID(),
        order: {
          locationId: SQUARE_LOCATION_ID,
          customerId,
          lineItems: lineItems.map((item) => ({
            name: item.name,
            quantity: String(item.qty),
            basePriceMoney: {
              amount: BigInt(item.amountCents),
              currency: "USD",
            },
          })),
        },
      });

      const orderId = orderRes.order!.id!;

      // 3. Create the invoice referencing the order
      const invoiceRes = await client.invoices.create({
        idempotencyKey: crypto.randomUUID(),
        invoice: {
          locationId: SQUARE_LOCATION_ID,
          orderId,
          primaryRecipient: { customerId },
          paymentRequests: [
            {
              requestType: "BALANCE",
              dueDate,
            },
          ],
          deliveryMethod: "EMAIL",
          invoiceNumber: `VYBE-${Date.now()}`,
          ...(note ? { description: note } : {}),
        },
      });

      const invoiceId = invoiceRes.invoice!.id!;
      const invoiceVersion = invoiceRes.invoice!.version!;

      // 4. Publish (sends email to customer)
      const publishRes = await client.invoices.publish({
        invoiceId,
        version: invoiceVersion,
        idempotencyKey: crypto.randomUUID(),
      });

      const inv = publishRes.invoice;
      res.status(201).json({
        invoiceId: inv?.id,
        invoiceNumber: inv?.invoiceNumber,
        status: inv?.status,
        publicUrl: inv?.publicUrl,
      });
    } catch (err: unknown) {
      req.log.error({ err }, "Failed to create Square invoice");
      const errors = (err as { errors?: { detail?: string }[] }).errors;
      const detail = errors?.[0]?.detail ?? "Invoice could not be created.";
      res.status(500).json({ error: detail });
    }
  },
);

export default router;
