import { sql } from "drizzle-orm";
import { datetime, foreignKey, int, mysqlEnum, mysqlTable, primaryKey, unique, varchar } from "drizzle-orm/mysql-core";
import { groups } from "./groups";

export const subgroups = mysqlTable(
  "subgroups",
  {
    subgroup_id: int("subgroup_id").autoincrement().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    parent_group_id: int("parent_group_id").notNull(),
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
      groups_groups_group_id_fk: foreignKey({
        columns: [table.parent_group_id],
        foreignColumns: [groups.group_id],
      }),
      groups_group_id: primaryKey(table.subgroup_id),
      unq: unique("unique_name_parent_group").on(table.name, table.parent_group_id),
    };
  },
);
