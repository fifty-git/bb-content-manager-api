import { sql } from "drizzle-orm";
import { boolean, datetime, decimal, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { bundle_variants } from "~/schema/bundles";
import { products } from "~/schema/products";

export const bundle_variant_options = mysqlTable(
  "bundle_variant_options",
  {
    bvo_id: int("bvo_id").autoincrement().notNull(),
    bundle_variant_id: int("bundle_variant_id")
      .notNull()
      .references(() => bundle_variants.bundle_variant_id),
    dropdown_name: varchar("dropdown_name", { length: 100 }).notNull(),
    creates_po: boolean("creates_po").default(false).notNull(),
    display_order: int("display_order").default(0).notNull(),
    status: mysqlEnum("status", ["inactive", "active"]).default("active").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      bundle_variant_options_bvo_id: primaryKey(table.bvo_id),
    };
  },
);

export const bundle_variant_option_values = mysqlTable(
  "bundle_variant_option_values",
  {
    bvov_id: int("bvov_id").autoincrement().notNull(),
    bvo_id: int("bvo_id")
      .notNull()
      .references(() => bundle_variant_options.bvo_id),
    product_id: int("product_id").references(() => products.product_id),
    value: varchar("value", { length: 100 }).notNull(),
    additional_price: decimal("additional_price", { precision: 10, scale: 2 }).default("0.00").notNull(),
    sku: varchar("sku", { length: 100 }).default("").notNull(),
    is_default: boolean("is_default").default(false).notNull(),
    display_order: int("display_order").default(0).notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      bundle_variant_option_values_bvov_id: primaryKey(table.bvov_id),
    };
  },
);
