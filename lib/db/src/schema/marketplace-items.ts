import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const marketplaceItemsTable = pgTable("marketplace_items", {
  squareItemId: text("square_item_id").primaryKey(),
  visible: boolean("visible").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MarketplaceItem = typeof marketplaceItemsTable.$inferSelect;
export type InsertMarketplaceItem = typeof marketplaceItemsTable.$inferInsert;
