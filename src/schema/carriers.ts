import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlEnum, mysqlTable, primaryKey, tinyint, varchar } from "drizzle-orm/mysql-core";
import { ServiceType, Status } from "~/core/domain/carriers/entity";

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
