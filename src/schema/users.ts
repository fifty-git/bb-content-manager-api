import { sql } from "drizzle-orm";
import { datetime, int, json, mysqlEnum, mysqlTable, primaryKey, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    user_id: int("user_id").autoincrement().notNull(),
    first_name: varchar("first_name", { length: 50 }).notNull(),
    last_name: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    login: varchar("login", { length: 50 }).notNull(),
    password: varchar("password", { length: 500 }).notNull(),
    secure_password: varchar("secure_password", { length: 128 }),
    status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
    created_at: timestamp("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      users_user_id: primaryKey(table.user_id),
      users_pk: unique("users_pk").on(table.login),
    };
  },
);

export const workspaces = mysqlTable(
  "workspaces",
  {
    workspace_id: int("workspace_id").autoincrement().notNull(),
    user_id: int("user_id")
      .notNull()
      .references(() => users.user_id),
    bookmarks: json("bookmarks").notNull(),
  },
  (table) => {
    return {
      workspaces_workspace_id: primaryKey(table.workspace_id),
    };
  },
);
