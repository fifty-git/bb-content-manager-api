import { sql } from "drizzle-orm";
import { datetime, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { products } from "~/schema/products";
import { sales_channels } from "~/schema/sales-channels";

export const product_offers = mysqlTable(
  "product_offers",
  {
    product_offer_id: int("product_offer_id").autoincrement().notNull(),
    product_id: int("product_id")
      .notNull()
      .references(() => products.product_id),
    sales_channel_id: int("sales_channel_id")
      .notNull()
      .references(() => sales_channels.sales_channel_id),
    name: varchar("name", { length: 255 }).notNull(),
    status: mysqlEnum("status", ["inactive", "draft", "active"]).default("draft").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      product_offers_product_offer_id: primaryKey(table.product_offer_id),
    };
  },
);
