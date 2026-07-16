import type { NextFunction, Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

// Augment Express Request to carry the verified customer email
declare global {
  namespace Express {
    interface Request {
      customerEmail?: string;
    }
  }
}

/**
 * Requires a signed-in Clerk user (any customer — not staff-gated).
 * Verifies the JWT from the Authorization header, looks up the user's
 * primary email via the Clerk API, and attaches it to req.customerEmail.
 * Never trusts caller-supplied email query params.
 */
export async function requireCustomerAuth(
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
    if (!email) {
      res.status(403).json({ error: "No verified email on this account" });
      return;
    }
    req.customerEmail = email;
    next();
  } catch (err) {
    req.log.error({ err }, "Failed to verify customer identity");
    res.status(401).json({ error: "Could not verify identity" });
  }
}
