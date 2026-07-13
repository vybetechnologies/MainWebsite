import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { CreateBookingRequestBody } from "@workspace/api-zod";
import { db, bookingRequestsTable } from "@workspace/db";
import { sendEmailViaResend } from "../lib/resend";
import { requireStaffAuth } from "../lib/staff-auth";

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
