import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlEnum, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { Days, ServiceType, Status } from "~/core/domain/carriers/entity";
import { cities } from "./countries";

export const carriers = mysqlTable(
  "carriers",
  {
    carrier_id: int("carrier_id").autoincrement().notNull(),
    code: varchar("code", { length: 50 }).notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    account_number: varchar("accountNumber", { length: 255 }).notNull(),
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

export const carrier_services = mysqlTable(
  "carrier_services",
  {
    carrier_service_id: int("carrier_service_id").autoincrement().notNull(),
    code: varchar("code", { length: 50 }).notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    type: mysqlEnum("type", [ServiceType.DOM, ServiceType.INT]).default(ServiceType.DOM).notNull(),
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

export const carrier_service_cities = mysqlTable(
  "carrier_service_cities",
  {
    carrier_service_city_id: int("carrier_service_city_id").autoincrement().notNull(),
    carrier_service_id: int("carrier_service_id")
      .notNull()
      .references(() => carrier_services.carrier_service_id),
    city_id: int("city_id")
      .notNull()
      .references(() => cities.city_id),
    transit_days: int("transit_days").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      carrier_services_cities_pk: primaryKey(table.carrier_service_city_id),
      carrier_service_carrier_service_cities_fk: index("carrier_service_id").on(table.carrier_service_id),
      cities_carrier_service_cities_fk: index("city_id").on(table.city_id),
    };
  },
);

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

export const carrier_service_high_seasons = mysqlTable(
  "carrier_service_high_seasons",
  {
    carrier_service_high_season_id: int("carrier_service_high_season_id").autoincrement().primaryKey(),
    carrier_service_id: int("carrier_service_id")
      .notNull()
      .references(() => carrier_services.carrier_service_id),
    start_date: datetime("start_date").notNull(),
    end_date: datetime("end_date").notNull(),
    extra_time: int("extra_time").notNull(),
    created_at: datetime("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      carrier_service_high_seasons_pk: primaryKey(table.carrier_service_high_season_id),
      carrier_services_carrier_service_high_seasons_fk: index("carrier_service_id").on(table.carrier_service_id),
    };
  },
);
