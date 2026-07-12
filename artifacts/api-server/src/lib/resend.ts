import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";

const RESEND_CONNECTOR_NAME = "resend";

export interface SendEmailArgs {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an email via the Resend API through the Replit connector proxy.
 * Never cache the connectors client -- create it fresh per call.
 */
export async function sendEmailViaResend(args: SendEmailArgs): Promise<void> {
  const connectors = new ReplitConnectors();

  const response = await connectors.proxy(RESEND_CONNECTOR_NAME, "/emails", {
    method: "POST",
    body: {
      from: args.from,
      to: [args.to],
      subject: args.subject,
      html: args.html,
      ...(args.replyTo ? { reply_to: args.replyTo } : {}),
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "<unreadable body>");
    logger.error(
      { status: response.status, body },
      "Resend email send failed",
    );
    throw new Error(`Resend API responded with status ${response.status}`);
  }
}
