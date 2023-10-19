import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const countries = mysqlTable("countries", {
  country_id: int("country_id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  created_at: datetime("created_at", { mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: datetime("updated_at", { mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const cities = mysqlTable(
  "cities",
  {
    city_id: int("city_id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    country_id: int("country_id")
      .notNull()
      .references(() => countries.country_id),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      cities_pk: primaryKey(table.city_id),
      cities_countries_fk: index("country_id").on(table.country_id),
    };
  },
);
