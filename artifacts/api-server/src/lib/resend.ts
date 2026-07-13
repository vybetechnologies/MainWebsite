import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";

const RESEND_CONNECTOR_NAME = "resend";
const RESEND_API_URL = "https://api.resend.com/emails";

export interface SendEmailArgs {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an email via Resend.
 *
 * Inside Replit (dev), routes through the Replit connector proxy, which manages
 * auth via the Resend integration -- no API key needed.
 *
 * Outside Replit (e.g. deployed to Fly.io), the connector proxy is unavailable,
 * so a `RESEND_API_KEY` env var must be set and we call the Resend API directly.
 */
export async function sendEmailViaResend(args: SendEmailArgs): Promise<void> {
  const body = {
    from: args.from,
    to: [args.to],
    subject: args.subject,
    html: args.html,
    ...(args.replyTo ? { reply_to: args.replyTo } : {}),
  };

  const resendApiKey = process.env["RESEND_API_KEY"];

  const response = resendApiKey
    ? await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    : await new ReplitConnectors().proxy(RESEND_CONNECTOR_NAME, "/emails", {
        method: "POST",
        body,
      });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "<unreadable body>");
    logger.error(
      { status: response.status, body: responseBody },
      "Resend email send failed",
    );
    throw new Error(`Resend API responded with status ${response.status}`);
  }
}
