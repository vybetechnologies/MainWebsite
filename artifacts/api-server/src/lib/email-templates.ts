/**
 * VYBE-branded HTML email templates.
 *
 * Design: dark background (#0a0a0a), white text, cyan accent (#00e5ff).
 * All values must be pre-escaped before being interpolated here.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function vybeLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VYBE Technologies</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#e0e0e0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo / wordmark -->
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #1e1e1e;">
              <span style="font-size:22px;font-weight:700;letter-spacing:0.12em;color:#ffffff;">
                VYBE<span style="color:#00e5ff;">.</span>
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 0;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;border-top:1px solid #1e1e1e;font-size:12px;color:#555;line-height:1.6;">
              VYBE Technologies &mdash; support@vybetechnologies.net<br/>
              This email was sent because your status was updated by our team.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Application status labels ──────────────────────────────────────────────────

const APPLICATION_STATUS_LABELS: Record<string, string> = {
  new: "Received",
  reviewing: "Under Review",
  interview: "Interview Stage",
  offer: "Offer Extended",
  hired: "Hired",
  rejected: "Not Moving Forward",
  withdrawn: "Withdrawn",
};

const APPLICATION_STATUS_MESSAGES: Record<string, string> = {
  new: "We have received your application and will be in touch soon.",
  reviewing: "Our team is currently reviewing your application. We'll keep you posted.",
  interview: "Great news! We'd like to invite you to an interview. Our team will reach out shortly with details.",
  offer: "We're pleased to extend an offer! Our team will contact you with the full details.",
  hired: "Welcome to the team! We're excited to have you on board.",
  rejected: "After careful consideration, we've decided to move forward with other candidates. We appreciate your interest and wish you the best.",
  withdrawn: "Your application has been marked as withdrawn. If this was a mistake, please reach out.",
};

export function buildApplicationStatusEmail(opts: {
  firstName: string;
  lastName: string;
  jobTitle: string;
  status: string;
}): { subject: string; html: string } {
  const label = APPLICATION_STATUS_LABELS[opts.status] ?? opts.status;
  const message =
    APPLICATION_STATUS_MESSAGES[opts.status] ??
    `Your application status has been updated to <strong style="color:#00e5ff;">${escapeHtml(label)}</strong>.`;

  const subject = `Your application update — ${escapeHtml(opts.jobTitle)}`;

  const content = `
    <p style="font-size:14px;color:#888;margin:0 0 8px 0;letter-spacing:0.08em;text-transform:uppercase;">Application Update</p>
    <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 24px 0;line-height:1.2;">
      ${escapeHtml(label)}
    </h1>
    <p style="font-size:16px;line-height:1.7;color:#c0c0c0;margin:0 0 20px 0;">
      Hi ${escapeHtml(opts.firstName)},
    </p>
    <p style="font-size:16px;line-height:1.7;color:#c0c0c0;margin:0 0 20px 0;">
      ${message}
    </p>
    <p style="font-size:14px;color:#666;margin:0;">
      Position applied for: <span style="color:#e0e0e0;">${escapeHtml(opts.jobTitle)}</span>
    </p>
  `;

  return { subject, html: vybeLayout(content) };
}

// ── Booking / repair status labels ────────────────────────────────────────────

const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  reviewing: "Under Review",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const BOOKING_STATUS_MESSAGES: Record<string, string> = {
  pending: "We have received your request and will review it shortly.",
  reviewing: "Our team is reviewing your repair request and will confirm the details with you soon.",
  in_progress: "Great news — your repair is now in progress. We'll notify you when it's ready.",
  completed: "Your repair has been completed! Please contact us if you have any questions.",
  cancelled: "Your repair request has been cancelled. If this was unexpected, please reach out.",
};

export function buildBookingStatusEmail(opts: {
  firstName: string;
  lastName: string;
  service: string;
  status: string;
}): { subject: string; html: string } {
  const label = BOOKING_STATUS_LABELS[opts.status] ?? opts.status;
  const message =
    BOOKING_STATUS_MESSAGES[opts.status] ??
    `Your repair request status has been updated to <strong style="color:#00e5ff;">${escapeHtml(label)}</strong>.`;

  const subject = `Your repair request update — ${escapeHtml(opts.service)}`;

  const content = `
    <p style="font-size:14px;color:#888;margin:0 0 8px 0;letter-spacing:0.08em;text-transform:uppercase;">Repair Update</p>
    <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 24px 0;line-height:1.2;">
      ${escapeHtml(label)}
    </h1>
    <p style="font-size:16px;line-height:1.7;color:#c0c0c0;margin:0 0 20px 0;">
      Hi ${escapeHtml(opts.firstName)},
    </p>
    <p style="font-size:16px;line-height:1.7;color:#c0c0c0;margin:0 0 20px 0;">
      ${message}
    </p>
    <p style="font-size:14px;color:#666;margin:0;">
      Service: <span style="color:#e0e0e0;">${escapeHtml(opts.service)}</span>
    </p>
  `;

  return { subject, html: vybeLayout(content) };
}
