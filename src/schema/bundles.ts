import { sql } from "drizzle-orm";
import { datetime, decimal, index, int, mysqlEnum, mysqlTable, primaryKey, unique, varchar } from "drizzle-orm/mysql-core";
import { groups } from "~/schema/groups";
import { products } from "~/schema/products";

export const bundles = mysqlTable(
  "bundles",
  {
    bundle_id: int("bundle_id").autoincrement().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 2000 }).default("").notNull(),
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
      bundles_bundle_id: primaryKey(table.bundle_id),
    };
  },
);

export const bundle_group_link = mysqlTable(
  "bundle_group_link",
  {
    bundle_group_id: int("bundle_group_id").autoincrement().notNull(),
    bundle_id: int("bundle_id")
      .notNull()
      .references(() => bundles.bundle_id),
    group_id: int("group_id")
      .notNull()
      .references(() => groups.group_id),
  },
  (table) => {
    return {
      bundle_group_link_bundle_group_id: primaryKey(table.bundle_group_id),
      bundle_group_link_pk2: unique("bundle_group_link_pk2").on(table.group_id, table.bundle_id),
    };
  },
);

export const bundle_product_link = mysqlTable(
  "bundle_product_link",
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
      bundle_product_link_bundle_product_id: primaryKey(table.bundle_product_id),
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
    units: int("units").notNull(),
    measure_units: varchar("measure_units", { length: 20 }).notNull(),
    upc: varchar("upc", { length: 50 }).default("").notNull(),
    display_order: int("display_order").default(0).notNull(),
    status: mysqlEnum("status", ["inactive", "active"]).default("active").notNull(),
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
