import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { Days, ServiceType, Status } from "~/core/domain/carriers/entity";
import { farms } from "./farms";

export const carriers = mysqlTable(
  "carriers",
  {
    carrier_id: int("carrier_id").autoincrement().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    status: mysqlEnum("status", [Status.ACTIVE, Status.INACTIVE]).default(Status.ACTIVE).notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      carriers_carrier_id: primaryKey(table.carrier_id),
    };
  },
);

export const carrier_accounts = mysqlTable("carrier_accounts", {
  account_id: int("account_id").autoincrement().primaryKey().notNull(),
  account_name: varchar("account_name", { length: 100 }).unique().notNull(),
  account_number: varchar("account_number", { length: 100 }).notNull()
});

export const farm_carrier_accounts_link = mysqlTable("farm_carrier_accounts_link", {
  account_id: int("account_id").references(() => carrier_accounts.account_id).primaryKey(),
  farm_id: int("farm_id").references(() => farms.farm_id).primaryKey(),
});

export const carrier_services = mysqlTable(
  "carrier_services",
  {
    carrier_service_id: int("carrier_service_id").autoincrement().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    type: mysqlEnum("type", [ServiceType.DOM, ServiceType.INT]).default(ServiceType.DOM).notNull(),
    transit_days: int("transit_days").notNull(),
    status: mysqlEnum("status", [Status.ACTIVE, Status.INACTIVE]).default(Status.ACTIVE).notNull(),
    carrier_id: int("carrier_id")
      .notNull()
      .references(() => carriers.carrier_id),
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
      carrier_services_carrier_service_id: primaryKey(table.carrier_service_id),
    };
  },
);

export const carrier_service_accounts_link = mysqlTable("carrier_service_accounts_link", {
  carrier_service_id: int("carrier_service_id").references(() => carrier_services.carrier_service_id).primaryKey().notNull(),
  account_id: int("account_id").references(() => carrier_accounts.account_id).primaryKey().notNull(),
});

export const carrier_service_days = mysqlTable(
  "carrier_service_days",
  {
    carrier_service_day_id: int("carrier_service_day_id").autoincrement().notNull(),
    carrier_service_id: int("carrier_service_id")
      .notNull()
      .references(() => carrier_services.carrier_service_id),
    day_name: mysqlEnum("day_name", [Days.MON, Days.TUE, Days.WED, Days.THU, Days.FRI, Days.SAT, Days.SUN]).notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      carrier_service_days_pk: primaryKey(table.carrier_service_day_id),
      carrier_service_carrier_service_days_fk: index("carrier_service_id").on(table.carrier_service_id),
    };
  },
);
