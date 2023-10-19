import { sql } from "drizzle-orm";
import { datetime, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const sales_channels = mysqlTable(
  "sales_channels",
  {
    sales_channel_id: int("sales_channel_id").autoincrement().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    status: mysqlEnum("status", ["inactive", "active"]).default("active").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      sales_channels_sales_channel_id: primaryKey(table.sales_channel_id),
    };
  },
);
