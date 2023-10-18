import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlTable, primaryKey } from "drizzle-orm/mysql-core";
import { products } from "~/schema/products";
import { tags } from "~/schema/tags";

export const product_tag_link = mysqlTable(
  "product_tag_link",
  {
    product_tag_link_id: int("product_tag_link_id").autoincrement().notNull(),
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
      product_tag_link_product_tag_link_id: primaryKey(table.product_tag_link_id),
    };
  },
);
