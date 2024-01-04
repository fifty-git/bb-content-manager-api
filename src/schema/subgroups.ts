import { sql } from "drizzle-orm";
import { index, int, mysqlEnum, mysqlTable, primaryKey, timestamp, unique, varchar } from "drizzle-orm/mysql-core";
import {groups} from "~/schema/groups";

export const subgroups = mysqlTable(
  "subgroups",
  {
    subgroup_id: int("subgroup_id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
    parent_group_id: int("parent_group_id")
      .notNull()
      .references(() => groups.group_id),
    created_at: timestamp("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      parent_group_id: index("parent_group_id").on(table.parent_group_id),
      subgroups_subgroup_id: primaryKey(table.subgroup_id),
      unique_name_parent_group: unique("unique_name_parent_group").on(table.name, table.parent_group_id),
    };
  },
);
