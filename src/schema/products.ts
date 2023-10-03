import { sql } from "drizzle-orm";
import { datetime, decimal, index, int, mysqlEnum, mysqlTable, primaryKey, tinyint, unique, varchar } from "drizzle-orm/mysql-core";
import { groups } from "~/schema/groups";
import { tags } from "~/schema/tags";

export const products = mysqlTable(
  "products",
  {
    product_id: int("product_id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 2000 }).default("").notNull(),
    upc: varchar("upc", { length: 50 }),
    status: mysqlEnum("status", ["inactive", "draft", "active"]).default("draft").notNull(),
    is_standalone: tinyint("is_standalone").default(1).notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      products_product_id: primaryKey(table.product_id),
    };
  },
);

export const product_group_link = mysqlTable(
  "product_group_link",
  {
    product_group_id: int("product_group_id").autoincrement().notNull(),
    product_id: int("product_id")
      .notNull()
      .references(() => products.product_id),
    group_id: int("group_id")
      .notNull()
      .references(() => groups.group_id),
  },
  (table) => {
    return {
      product_group_link_product_group_id: primaryKey(table.product_group_id),
      product_group_link_pk: unique("product_group_link_pk").on(table.group_id, table.product_id),
    };
  },
);

export const product_tag_link = mysqlTable(
  "product_tag_link",
  {
    tag_id: int("tag_id")
      .notNull()
      .references(() => tags.tag_id),
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
      product_id: index("product_id").on(table.product_id),
      tag_id: index("tag_id").on(table.tag_id),
    };
  },
);

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
      product_variants_variant_id: primaryKey(table.variant_id),
    };
  },
);

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
    active: tinyint("active").default(1).notNull(),
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
