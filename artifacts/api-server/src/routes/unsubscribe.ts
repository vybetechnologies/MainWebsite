import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, emailOptOutsTable } from "@workspace/db";
import { verifyUnsubscribeToken } from "../lib/unsubscribe-token";

const router: IRouter = Router();

/**
 * Public endpoint — no auth required.
 * GET /unsubscribe?email=...&token=...
 *
 * Verifies the HMAC token, records the opt-out, and returns a plain-text
 * confirmation (or a simple HTML page the customer can read in their browser).
 */
router.get("/unsubscribe", async (req, res): Promise<void> => {
  const email = typeof req.query.email === "string" ? req.query.email.trim() : "";
  const token = typeof req.query.token === "string" ? req.query.token.trim() : "";

  if (!email || !token) {
    res.status(400).send(unsubscribePage("Invalid link", "This unsubscribe link is missing required parameters."));
    return;
  }

  if (!verifyUnsubscribeToken(email, token)) {
    res.status(403).send(unsubscribePage("Invalid link", "This unsubscribe link is invalid or has been tampered with."));
    return;
  }

  try {
    // Upsert — idempotent if already opted out.
    await db
      .insert(emailOptOutsTable)
      .values({ email: email.toLowerCase() })
      .onConflictDoNothing();

    req.log.info({ email: email.toLowerCase() }, "Email opt-out recorded");
    res.status(200).send(
      unsubscribePage(
        "You've been unsubscribed",
        `The email address <strong>${escapeHtml(email)}</strong> will no longer receive status-update emails from VYBE Technologies.<br/><br/>If this was a mistake, please contact us at <a href="mailto:support@vybetechnologies.net" style="color:#00e5ff;">support@vybetechnologies.net</a>.`,
      ),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to record email opt-out");
    res.status(500).send(unsubscribePage("Error", "Something went wrong. Please try again or contact support."));
  }
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unsubscribePage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — VYBE Technologies</title>
</head>
<body style="margin:0;padding:40px 16px;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#e0e0e0;text-align:center;">
  <div style="max-width:480px;margin:0 auto;">
    <p style="font-size:22px;font-weight:700;letter-spacing:0.12em;color:#ffffff;margin-bottom:32px;">
      VYBE<span style="color:#00e5ff;">.</span>
    </p>
    <h1 style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:16px;">${escapeHtml(title)}</h1>
    <p style="font-size:15px;line-height:1.7;color:#c0c0c0;">${body}</p>
  </div>
</body>
</html>`;
}

export default router;
