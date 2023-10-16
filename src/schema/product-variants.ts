import { sql } from "drizzle-orm";
import { boolean, datetime, decimal, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { products } from "~/schema/products";

export const product_variants = mysqlTable(
  "product_variants",
  {
    variant_id: int("variant_id").autoincrement().notNull(),
    product_id: int("product_id")
      .notNull()
      .references(() => products.product_id),
    name: varchar("name", { length: 255 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    units: int("units").notNull(),
    measure_units: varchar("measure_units", { length: 20 }).notNull(),
    upc: varchar("upc", { length: 50 }).default("").notNull(),
    creates_po: boolean("creates_po").default(true).notNull(),
    is_default: boolean("is_default").default(false).notNull(),
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
      product_variants_variant_id: primaryKey(table.variant_id),
    };
  },
);

export const variant_options = mysqlTable(
  "variant_options",
  {
    variant_option_id: int("variant_option_id").autoincrement().notNull(),
    variant_id: int("variant_id")
      .references(() => product_variants.variant_id)
      .notNull(),
    dropdown_name: varchar("dropdown_name", { length: 100 }).notNull(),
    creates_po: boolean("creates_po").notNull(),
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
      variant_option_values_variant_option_value_id: primaryKey(table.variant_option_value_id),
    };
  },
);
