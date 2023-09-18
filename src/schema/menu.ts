import { sql } from "drizzle-orm";
import { datetime, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const menu = mysqlTable(
  "menu",
  {
    menu_id: int("menu_id").autoincrement().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    href: varchar("href", { length: 50 }).notNull(),
    default_href: varchar("default_href", { length: 50 }).notNull(),
    icon: varchar("icon", { length: 50 }).notNull(),
    role: varchar("role", { length: 50 }).default("default").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      menu_menu_id: primaryKey(table.menu_id),
    };
  },
);

export const submenu = mysqlTable(
  "submenu",
  {
    submenu_id: int("submenu_id").autoincrement().notNull(),
    menu_id: int("menu_id")
      .notNull()
      .references(() => menu.menu_id),
    name: varchar("name", { length: 50 }).notNull(),
    href: varchar("href", { length: 50 }).notNull(),
    role: varchar("role", { length: 50 }).default("default").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      submenu_submenu_id: primaryKey(table.submenu_id),
    };
  },
);
