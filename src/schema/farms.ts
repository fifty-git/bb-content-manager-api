import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlTable, primaryKey, tinyint, varchar } from "drizzle-orm/mysql-core";
import { carrier_services, carriers } from "~/schema/carriers";
import { product_varieties } from "~/schema/products";

export const farms = mysqlTable(
  "farms",
  {
    farm_id: int("farm_id").autoincrement().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    country: varchar("country", { length: 50 }).notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    email: varchar("email", { length: 50 }).notNull(),
    active: tinyint("active").default(1).notNull(),
    carrier_id: int("carrier_id")
      .notNull()
      .references(() => carriers.carrier_id),
    service_id: int("service_id")
      .notNull()
      .references(() => carrier_services.carrier_service_id),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      carrier_id: index("carrier_id").on(table.carrier_id),
      service_id: index("service_id").on(table.service_id),
      farms_farm_id: primaryKey(table.farm_id),
    };
  },
);

export const farm_product_varieties = mysqlTable(
  "farm_product_varieties",
  {
    farm_product_variety_id: int("farm_product_variety_id").autoincrement().notNull(),
    farm_id: int("farm_id")
      .notNull()
      .references(() => farms.farm_id),
    variety_id: int("variety_id")
      .notNull()
      .references(() => product_varieties.product_variety_id),
    created_at: datetime("created_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      farm_id: index("farm_id").on(table.farm_id),
      variety_id: index("variety_id").on(table.variety_id),
      farm_product_varieties_farm_product_variety_id: primaryKey(table.farm_product_variety_id),
    };
  },
);
