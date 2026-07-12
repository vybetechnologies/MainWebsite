import { Router, type IRouter } from "express";
import { CreateBookingRequestBody } from "@workspace/api-zod";
import { sendEmailViaResend } from "../lib/resend";

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

  const { firstName, lastName, email, phone, service, message } = parsed.data;

  const html = `
    <h2>New Booking Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone ?? "Not provided")}</p>
    <p><strong>Service Needed:</strong> ${escapeHtml(service)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    await sendEmailViaResend({
      to: BOOKING_NOTIFICATION_TO,
      from: BOOKING_NOTIFICATION_FROM,
      subject: `New booking request from ${firstName} ${lastName}`,
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

export default router;
