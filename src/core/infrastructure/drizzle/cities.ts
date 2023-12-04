import { eq } from "drizzle-orm";
import { db } from "~/modules/drizzle";
import { cities } from "~/schema/countries";

export class CitiesDS {
  static async getAllCitiesByCountryID(country_id: number) {
    return db
      .select({
        city_id: cities.city_id,
        city_name: cities.name,
      })
      .from(cities)
      .where(eq(cities.country_id, country_id))
      .prepare()
      .execute();
  }
}
