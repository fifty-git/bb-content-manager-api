import { sql } from "drizzle-orm";
import { datetime, decimal, int, mysqlTable, primaryKey, tinyint, varchar } from "drizzle-orm/mysql-core";
import { product_variants, products } from "~/schema/products";
import {mysqlEnum} from "drizzle-orm/mysql-core/index";

export const variant_options = mysqlTable(
  "variant_options",
  {
    variant_option_id: int("variant_option_id").autoincrement().notNull(),
    variant_id: int("variant_id").references(() => product_variants.variant_id),
    dropdown_name: varchar("dropdown_name", { length: 100 }).notNull(),
    creates_po: tinyint("creates_po").notNull(),
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
      variant_options_variant_option_id: primaryKey(table.variant_option_id),
    };
  },
);

export const variant_option_values = mysqlTable(
  "variant_option_values",
  {
    variant_option_value_id: int("variant_option_value_id").autoincrement().notNull(),
    variant_option_id: int("variant_option_id")
      .notNull()
      .references(() => variant_options.variant_option_id),
    product_id: int("product_id").references(() => products.product_id),
    value: varchar("value", { length: 100 }).notNull(),
    additional_price: decimal("additional_price", { precision: 10, scale: 2 }).default("0.00").notNull(),
    sku: varchar("sku", { length: 100 }).default("").notNull(),
    is_default: tinyint("is_default").default(0).notNull(),
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
      variant_option_values_variant_option_value_id: primaryKey(table.variant_option_value_id),
    };
  },
);
