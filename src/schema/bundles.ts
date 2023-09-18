import { sql } from "drizzle-orm";
import { datetime, decimal, index, int, mysqlTable, primaryKey, text, tinyint, varchar } from "drizzle-orm/mysql-core";
import { options_catalog, products } from "~/schema/products";

export const bundles = mysqlTable(
  "bundles",
  {
    bundle_id: int("bundle_id").autoincrement().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description").notNull(),
    active: tinyint("active").default(1).notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      bundles_bundle_id: primaryKey(table.bundle_id),
    };
  },
);
export const bundle_options = mysqlTable(
  "bundle_options",
  {
    bundle_option_id: int("bundle_option_id").autoincrement().notNull(),
    bundle_id: int("bundle_id").references(() => bundles.bundle_id),
    option_catalog_id: int("option_catalog_id").references(() => options_catalog.option_catalog_id),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      bundle_options_bundle_option_id: primaryKey(table.bundle_option_id),
    };
  },
);

export const bundle_products = mysqlTable(
  "bundle_products",
  {
    bundle_product_id: int("bundle_product_id").autoincrement().notNull(),
    bundle_id: int("bundle_id")
      .notNull()
      .references(() => bundles.bundle_id),
    product_id: int("product_id")
      .notNull()
      .references(() => products.product_id),
    created_at: datetime("created_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      bundle_id: index("bundle_id").on(table.bundle_id),
      product_id: index("product_id").on(table.product_id),
      bundle_products_bundle_product_id: primaryKey(table.bundle_product_id),
    };
  },
);

export const bundle_variants = mysqlTable(
  "bundle_variants",
  {
    bundle_variant_id: int("bundle_variant_id").autoincrement().notNull(),
    bundle_id: int("bundle_id")
      .notNull()
      .references(() => bundles.bundle_id),
    name: varchar("name", { length: 255 }).notNull(),
    price: decimal("price", { precision: 6, scale: 2 }).notNull(),
    active: tinyint("active").default(0).notNull(),
    created_at: datetime("created_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      bundle_id: index("bundle_id").on(table.bundle_id),
      bundle_variants_bundle_variant_id: primaryKey(table.bundle_variant_id),
    };
  },
);
