import { sql } from "drizzle-orm";
import { datetime, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const groups = mysqlTable(
  "groups",
  {
    group_id: int("group_id").autoincrement().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      groups_group_id: primaryKey(table.group_id),
    };
  },
);
