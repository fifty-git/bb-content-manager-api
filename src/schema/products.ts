import { sql } from "drizzle-orm";
import {
  datetime,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { tags } from "~/schema/tags";

export const products = mysqlTable(
  "products",
  {
    product_id: int("product_id").autoincrement().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description").notNull(),
    upc: varchar("upc", { length: 50 }).notNull(),
    active: tinyint("active").default(1).notNull(),
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
      products_pk: unique("products_pk").on(table.upc),
    };
  },
);
export const options_catalog = mysqlTable(
  "options_catalog",
  {
    option_catalog_id: int("option_catalog_id").autoincrement().notNull(),
    dropdown_name: varchar("dropdown_name", { length: 100 }),
    product_exists: tinyint("product_exists").default(1),
    creates_po: tinyint("creates_po").default(1),
    manual_options: json("manual_options"),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      options_catalog_option_catalog_id: primaryKey(table.option_catalog_id),
    };
  },
);

export const product_options = mysqlTable(
  "product_options",
  {
    product_option_id: int("product_option_id").autoincrement().notNull(),
    option_catalog_id: int("option_catalog_id").references(() => options_catalog.option_catalog_id),
    product_id: int("product_id").references(() => products.product_id),
    option_name: varchar("option_name", { length: 100 }),
    additional_price: decimal("additional_price", { precision: 10, scale: 0 }).notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      product_options_product_option_id: primaryKey(table.product_option_id),
    };
  },
);

export const product_tags = mysqlTable(
  "product_tags",
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
      tag_id: index("tag_id").on(table.tag_id),
      product_id: index("product_id").on(table.product_id),
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
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    units: int("units").notNull(),
    measure_units: varchar("measure_units", { length: 20 }).notNull(),
    season_start: mysqlEnum("season_start", ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
      .default("Jan")
      .notNull(),
    season_end: mysqlEnum("season_end", ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
      .default("Dec")
      .notNull(),
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
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 255 }).notNull(),
    cost: decimal("cost", { precision: 6, scale: 2 }).default("0.00").notNull(),
    active: tinyint("active").default(1).notNull(),
    quality: mysqlEnum("quality", ["A", "B", "C"]).default("A").notNull(),
    product_id: int("product_id")
      .default(1)
      .notNull()
      .references(() => products.product_id),
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
