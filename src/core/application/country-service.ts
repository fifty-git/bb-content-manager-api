import type { EnvAPI } from "../domain/types";
import type { Context } from "hono";
import { CitiesDS } from "../infrastructure/drizzle/cities";
import { CountriesDS } from "../infrastructure/drizzle/countries";

export async function getAllCountries(c: Context<EnvAPI>) {
  const countries = await CountriesDS.getAllCountries();
  const composed = await Promise.all(
    countries.map(async (country) => {
      const cities = await CitiesDS.getAllCitiesByCountryID(country.country_id);
      return {
        ...country,
        cities,
      };
    }),
  );

  return c.json(
    {
      status: "success",
      data: composed,
    },
    200,
  );
}
