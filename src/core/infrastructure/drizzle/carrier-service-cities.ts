import type { NewCarrierServiceCity, ServiceCity } from "~/core/domain/carriers/entity";
import type { Transaction } from "~/core/domain/types";
import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { carrier_service_cities } from "~/schema/carriers";
import { cities } from "~/schema/countries";

export class CarrierServiceCitiesDS {
  static async getByServiceID(service_id: number): Promise<ServiceCity[]> {
    return db
      .select({
        carrier_service_city_id: carrier_service_cities.carrier_service_city_id,
        city_id: carrier_service_cities.city_id,
        city_name: cities.name,
        transit_days: carrier_service_cities.transit_days,
      })
      .from(carrier_service_cities)
      .innerJoin(cities, eq(carrier_service_cities.city_id, cities.city_id))
      .where(eq(carrier_service_cities.carrier_service_id, service_id))
      .prepare()
      .execute();
  }

  static async createMany(cities: NewCarrierServiceCity[], tx?: Transaction) {
    return Promise.all(cities.map((city) => (tx || db).insert(carrier_service_cities).values(city).prepare().execute()));
  }

  static async updateMany(cities: ServiceCity[], tx?: Transaction) {
    return Promise.all(
      cities.map((city) =>
        (tx || db)
          .update(carrier_service_cities)
          .set(city)
          .where(eq(carrier_service_cities.carrier_service_city_id, city.carrier_service_city_id)),
      ),
    );
  }

  static async deleteByServiceID(service_id: number, tx?: Transaction) {
    return (tx || db).delete(carrier_service_cities).where(eq(carrier_service_cities.carrier_service_id, service_id)).prepare().execute();
  }
}
