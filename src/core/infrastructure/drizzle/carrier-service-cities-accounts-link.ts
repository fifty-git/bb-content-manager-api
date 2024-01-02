import type { NewCarrierServiceAccount } from "../../domain/carriers/entity";
import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { carrier_accounts, carrier_service_account_city_link, carrier_services } from "~/schema/carriers";
import { cities } from "~/schema/countries";

export class CarrierServiceCitiesAccountsLink {
  static getByServiceID(service_id: number) {
    return db
      .select({
        account: {
          account_id: carrier_service_account_city_link.account_id,
          name: carrier_accounts.name,
          number: carrier_accounts.number,
        },
        city: {
          city_id: carrier_service_account_city_link.city_id,
          name: cities.name,
        },
        transit_days: carrier_service_account_city_link.transit_days,
        pickup_days: carrier_service_account_city_link.pickup_days,
      })
      .from(carrier_service_account_city_link)
      .innerJoin(cities, eq(carrier_service_account_city_link.city_id, cities.city_id))
      .innerJoin(carrier_accounts, eq(carrier_service_account_city_link.account_id, carrier_accounts.account_id))
      .where(eq(carrier_service_account_city_link.carrier_service_id, service_id))
      .prepare()
      .execute();
  }

  static async getByAccountID(account_id: number) {
    return db
      .select({
        service: {
          carrier_service_id: carrier_services.carrier_service_id,
          name: carrier_services.name,
          status: carrier_services.status,
        },
        city: {
          city_id: cities.city_id,
          name: cities.name,
        },
      })
      .from(carrier_services)
      .innerJoin(
        carrier_service_account_city_link,
        eq(carrier_services.carrier_service_id, carrier_service_account_city_link.carrier_service_id),
      )
      .innerJoin(carrier_accounts, eq(carrier_accounts.account_id, carrier_service_account_city_link.account_id))
      .innerJoin(cities, eq(cities.city_id, carrier_service_account_city_link.city_id))
      .where(eq(carrier_service_account_city_link.account_id, account_id))
      .prepare()
      .execute();
  }

  static async createMany(origins: (NewCarrierServiceAccount & { carrier_service_id: number })[], tx?: Transaction) {
    return (tx || db).insert(carrier_service_account_city_link).values(origins).prepare().execute();
  }

  static async deleteByServiceID(service_id: number, tx?: Transaction) {
    return (tx || db)
      .delete(carrier_service_account_city_link)
      .where(eq(carrier_service_account_city_link.carrier_service_id, service_id))
      .prepare()
      .execute();
  }

  static async deleteByAccountID(account_id: number, tx?: Transaction) {
    return (tx || db)
      .delete(carrier_service_account_city_link)
      .where(eq(carrier_service_account_city_link.account_id, account_id))
      .prepare()
      .execute();
  }
}
