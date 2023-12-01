import { sql } from "drizzle-orm";
import { boolean, datetime, index, int, mysqlEnum, mysqlTable, primaryKey, unique, varchar } from "drizzle-orm/mysql-core";
import { groups } from "~/schema/groups";
import { sales_channels } from "~/schema/sales-channels";
import { tags } from "~/schema/tags";

export const products = mysqlTable(
  "products",
  {
    product_id: int("product_id").autoincrement().notNull(),
    sales_channel_id: int("sales_channel_id")
      .default(1)
      .notNull()
      .references(() => sales_channels.sales_channel_id),
    subgroup_id: int("subgroup_id"),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 2000 }).default("").notNull(),
    is_standalone: boolean("is_standalone").default(true).notNull(),
    product_type: mysqlEnum("product_type", ["single", "bundle"]).default("single").notNull(),
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
    subgroup_id: int("subgroup_id")
      .notNull()
      .references(() => groups.group_id),
  },
  (table) => {
    return {
      product_group_link_product_group_id: primaryKey(table.product_group_id),
      product_group_link_pk: unique("product_group_link_pk").on(table.subgroup_id, table.product_id),
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
