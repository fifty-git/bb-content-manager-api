import { db } from "~/modules/drizzle";
import { countries } from "~/schema/countries";

export class CountriesDS {
  static async getAllCountries() {
    return db.select().from(countries).prepare().execute();
  }
}
