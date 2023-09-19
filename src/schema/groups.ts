import { sql } from "drizzle-orm";
import { datetime, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const groups = mysqlTable(
  "groups",
  {
    group_id: int("group_id").autoincrement().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    parent_group_id: int("parent_group_id"),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      groups_groups_group_id_fk: foreignKey({
        columns: [table.parent_group_id],
        foreignColumns: [table.group_id],
      }),
      groups_group_id: primaryKey(table.group_id),
    };
  },
);
