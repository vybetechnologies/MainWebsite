import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { CreateBookingRequestBody } from "@workspace/api-zod";
import { db, bookingRequestsTable, updateBookingRequestSchema } from "@workspace/db";
import { sendEmailViaResend } from "../lib/resend";
import { requireStaffAuth } from "../lib/staff-auth";
import { addSseClient, removeSseClient, notifyNewBooking } from "../lib/booking-sse";
import { buildBookingStatusEmail } from "../lib/email-templates";

const NOTIFICATIONS_FROM =
  process.env["NOTIFICATIONS_FROM"] ?? "notifications@vybetechnologies.net";

const router: IRouter = Router();

const BOOKING_NOTIFICATION_FROM =
  process.env["BOOKING_NOTIFICATION_FROM"] ?? "bookings@vybetechnologies.net";
const BOOKING_NOTIFICATION_TO =
  process.env["BOOKING_NOTIFICATION_TO"] ?? "support@vybetechnologies.net";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

router.post("/booking-requests", async (req, res): Promise<void> => {
  const parsed = CreateBookingRequestBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid booking request body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    service,
    message,
    deviceType,
    brandModel,
    preferredServiceType,
    preferredDate,
    photoObjectPath,
  } = parsed.data;

  const optionalRows = [
    deviceType ? `<p><strong>Device Type:</strong> ${escapeHtml(deviceType)}</p>` : "",
    brandModel ? `<p><strong>Brand / Model:</strong> ${escapeHtml(brandModel)}</p>` : "",
    preferredServiceType
      ? `<p><strong>Preferred Service Type:</strong> ${escapeHtml(preferredServiceType)}</p>`
      : "",
    preferredDate ? `<p><strong>Preferred Date:</strong> ${escapeHtml(preferredDate)}</p>` : "",
    photoObjectPath
      ? `<p><strong>Photo Attached:</strong> ${escapeHtml(photoObjectPath)}</p>`
      : "",
  ].join("");

  const html = `
    <h2>New Booking Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone ?? "Not provided")}</p>
    <p><strong>Service Needed:</strong> ${escapeHtml(service)}</p>
    ${optionalRows}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    await db.insert(bookingRequestsTable).values({
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
      deviceType,
      brandModel,
      preferredServiceType,
      preferredDate,
      photoObjectPath,
    });
    // Notify any connected staff browsers immediately.
    notifyNewBooking();
  } catch (err) {
    // Don't block the submission on a DB hiccup — the email notification is
    // the primary channel; persistence just backs it up for the staff dashboard.
    req.log.error({ err }, "Failed to persist booking request");
  }

  try {
    await sendEmailViaResend({
      to: BOOKING_NOTIFICATION_TO,
      from: BOOKING_NOTIFICATION_FROM,
      subject: `[${service}] New request from ${firstName} ${lastName}`,
      html,
      replyTo: email,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to send booking request email");
    res.status(502).json({ error: "Failed to send booking request" });
    return;
  }

  res.status(201).json({ success: true });
});

/**
 * SSE stream — staff browsers connect here to receive instant push
 * notifications when a new booking request is created.
 *
 * EventSource (used by browsers) automatically sends cookies, so the
 * Clerk session cookie is forwarded and requireStaffAuth works normally.
 * No sensitive booking data is transmitted over the stream; clients
 * react to the event by calling the authenticated REST endpoint.
 */
router.get("/booking-requests/stream", requireStaffAuth, (req, res): void => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // Disable response buffering so chunks are flushed immediately.
  res.flushHeaders();

  addSseClient(res);

  // Send an initial heartbeat so the browser knows the connection is live.
  res.write(": connected\n\n");

  // Keep the connection alive with a periodic heartbeat comment (no event fired).
  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
    }
  }, 25_000);

  const cleanup = () => {
    clearInterval(heartbeat);
    removeSseClient(res);
  };

  req.on("close", cleanup);
  req.on("error", cleanup);
});

// ── Staff: update booking request status ──────────────────────────────────────

router.patch("/staff/booking-requests/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const { id } = req.params;
  const parsed = updateBookingRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [booking] = await db
      .update(bookingRequestsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(bookingRequestsTable.id, id))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "Booking request not found" });
      return;
    }

    // Send a status-change email to the customer when status is updated.
    if (parsed.data.status) {
      try {
        const { subject, html } = buildBookingStatusEmail({
          firstName: booking.firstName,
          lastName: booking.lastName,
          service: booking.service,
          status: booking.status,
        });
        await sendEmailViaResend({
          to: booking.email,
          from: NOTIFICATIONS_FROM,
          subject,
          html,
        });
      } catch (emailErr) {
        // Log but do not block — the status update already succeeded.
        req.log.error({ err: emailErr }, "Failed to send booking status email");
      }
    }

    res.status(200).json({ booking });
  } catch (err) {
    req.log.error({ err }, "Failed to update booking request");
    res.status(500).json({ error: "Failed to update booking request" });
  }
});

router.get("/booking-requests", requireStaffAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(bookingRequestsTable)
    .orderBy(desc(bookingRequestsTable.createdAt))
    .limit(200);

  res.json({
    requests: rows.map((row) => ({
      ...row,
      phone: row.phone ?? undefined,
      deviceType: row.deviceType ?? undefined,
      brandModel: row.brandModel ?? undefined,
      preferredServiceType: row.preferredServiceType ?? undefined,
      preferredDate: row.preferredDate ?? undefined,
      photoObjectPath: row.photoObjectPath ?? undefined,
      createdAt: row.createdAt.toISOString(),
    })),
  });
});

export default router;
