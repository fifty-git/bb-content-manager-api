import { sql } from "drizzle-orm";
import { boolean, datetime, decimal, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { products } from "~/schema/products";

export const product_varieties = mysqlTable(
  "product_varieties",
  {
    product_variety_id: int("product_variety_id").autoincrement().notNull(),
    product_id: int("product_id")
      .notNull()
      .references(() => products.product_id),
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 255 }).notNull(),
    cost: decimal("cost", { precision: 6, scale: 2 }).default("0.00").notNull(),
    active: boolean("active").default(true).notNull(),
    quality: mysqlEnum("quality", ["A", "B", "C"]).default("A").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      product_varieties_product_variety_id: primaryKey(table.product_variety_id),
    };
  },
);
