// import { sql } from "drizzle-orm";
// import { datetime, decimal, int, mysqlEnum, mysqlTable, primaryKey, tinyint, unique, varchar } from "drizzle-orm/mysql-core";
//
// export const product_bundles = mysqlTable(
//   "product_bundles",
//   {
//     bundle_id: int("bundle_id").autoincrement().notNull(),
//     name: varchar("name", { length: 100 }).notNull(),
//     price: decimal("price", { precision: 10, scale: 2 }).notNull(),
//     active: tinyint("active").default(1).notNull(),
//     created_at: datetime("created_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
//   },
//   (table) => {
//     return {
//       product_bundles_bundle_id: primaryKey(table.bundle_id),
//     };
//   },
// );
//
// export const products = mysqlTable(
//   "products",
//   {
//     product_id: int("product_id").autoincrement().notNull(),
//     name: varchar("name", { length: 100 }).notNull(),
//     description: varchar("description", { length: 100 }).notNull(),
//     upc: varchar("upc", { length: 50 }).notNull(),
//     active: tinyint("active").default(1).notNull(),
//     created_at: datetime("created_at", { mode: "string" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updated_at: datetime("updated_at", { mode: "string" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//   },
//   (table) => {
//     return {
//       products_product_id: primaryKey(table.product_id),
//       products_pk: unique("products_pk").on(table.upc),
//     };
//   },
// );
//
// export const product_variants = mysqlTable(
//   "product_variants",
//   {
//     variant_id: int("variant_id").autoincrement().notNull(),
//     product_id: int("product_id")
//       .notNull()
//       .references(() => products.product_id),
//     name: varchar("name", { length: 100 }).notNull(),
//     description: varchar("description", { length: 500 }).notNull(),
//     price: decimal("price", { precision: 10, scale: 2 }).notNull(),
//     units: int("units").notNull(),
//     measure_units: varchar("measure_units", { length: 20 }).notNull(),
//     season_start: mysqlEnum("season_start", ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
//       .default("Jan")
//       .notNull(),
//     season_end: mysqlEnum("season_end", ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
//       .default("Dec")
//       .notNull(),
//     active: tinyint("active").default(1).notNull(),
//     created_at: datetime("created_at", { mode: "string" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updated_at: datetime("updated_at", { mode: "string" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//   },
//   (table) => {
//     return {
//       product_variants_variant_id: primaryKey(table.variant_id),
//     };
//   },
// );
//
// export const product_variants_to_bundle = mysqlTable(
//   "product_variants_to_bundle",
//   {
//     variant_to_bundle_id: int("variant_to_bundle_id").autoincrement().notNull(),
//     bundle_id: int("bundle_id")
//       .notNull()
//       .references(() => product_bundles.bundle_id),
//     variant_id: int("variant_id")
//       .notNull()
//       .references(() => product_variants.variant_id),
//     additional_price: decimal("additional_price", { precision: 10, scale: 2 }).default("0.00").notNull(),
//     created_a: datetime("created_a", { mode: "string" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updated_at: datetime("updated_at", { mode: "string" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//   },
//   (table) => {
//     return {
//       product_variants_to_bundle_variant_to_bundle_id: primaryKey(table.variant_to_bundle_id),
//     };
//   },
// );
