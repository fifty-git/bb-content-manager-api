import { sql } from "drizzle-orm";
import { datetime, int, mysqlEnum, mysqlTable, primaryKey, unique, varchar } from "drizzle-orm/mysql-core";

export const tags = mysqlTable(
  "tags",
  {
    tag_id: int("tag_id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: mysqlEnum("type", ["PRODUCT", "ORDER", "PURCHASE ORDER", "SEARCHABLE"]).default("PRODUCT").notNull(),
    created_at: datetime("created_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      tags_tag_id: primaryKey(table.tag_id),
      name: unique("name").on(table.name),
    };
  },
);
