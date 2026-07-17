import { pgTable, text, boolean, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const partnersTable = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  website: text("website").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPartnerSchema = createInsertSchema(partnersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePartnerSchema = insertPartnerSchema.partial();

export type Partner = typeof partnersTable.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;
