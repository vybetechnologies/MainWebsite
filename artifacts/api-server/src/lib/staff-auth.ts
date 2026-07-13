import type { NextFunction, Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

// Staff who are allowed to view submitted contact / booking / careers
// requests. Not a secret — just an allow-list of business email addresses.
// Override/extend via STAFF_ALLOWED_EMAILS (comma-separated) without a code change.
const DEFAULT_STAFF_EMAILS = [
  "mason@vybetechnologies.net",
  "mavis@vybetechnologies.net",
];

const STAFF_ALLOWED_EMAILS = (process.env["STAFF_ALLOWED_EMAILS"] ?? DEFAULT_STAFF_EMAILS.join(","))
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/**
 * Requires a signed-in Clerk user whose primary email is on the staff
 * allow-list. Returns 401 if not signed in, 403 if signed in but not staff.
 */
export async function requireStaffAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Sign in required" });
    return;
  }

  try {
    const user = await clerkClient.users.getUser(auth.userId);
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    if (!email || !STAFF_ALLOWED_EMAILS.includes(email)) {
      res.status(403).json({ error: "Not an authorized staff account" });
      return;
    }
    next();
  } catch (err) {
    req.log.error({ err }, "Failed to verify staff account");
    res.status(403).json({ error: "Not an authorized staff account" });
  }
}
