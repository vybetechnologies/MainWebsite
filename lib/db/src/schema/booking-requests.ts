import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Persisted record of every contact / booking / careers submission sent
 * through the public forms. Written in addition to the notification email
 * so staff can review submissions later even if the email failed or was
 * missed, and so the staff dashboard has something to read from.
 */
export const bookingRequestsTable = pgTable("booking_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  deviceType: text("device_type"),
  brandModel: text("brand_model"),
  preferredServiceType: text("preferred_service_type"),
  preferredDate: text("preferred_date"),
  photoObjectPath: text("photo_object_path"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BookingRequestRow = typeof bookingRequestsTable.$inferSelect;
