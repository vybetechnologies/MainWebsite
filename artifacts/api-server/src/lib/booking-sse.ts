/**
 * Lightweight in-process SSE broadcast for booking request notifications.
 *
 * When a new booking is saved, call `notifyNewBooking()`.  All staff browser
 * tabs that are connected to the `/api/booking-requests/stream` endpoint will
 * receive a `new-booking` event immediately.
 */

import type { Response } from "express";

// Track every live SSE response object.
const clients = new Set<Response>();

/** Register a new SSE client (called when the stream endpoint opens). */
export function addSseClient(res: Response): void {
  clients.add(res);
}

/** Deregister an SSE client (called on close / error). */
export function removeSseClient(res: Response): void {
  clients.delete(res);
}

/** Broadcast a `new-booking` event to every connected client. */
export function notifyNewBooking(): void {
  const payload = `event: new-booking\ndata: {}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch {
      // Client already gone; clean it up.
      clients.delete(res);
    }
  }
}
