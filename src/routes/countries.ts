import { Hono } from "hono";
import { getAllCountries } from "~/core/application/country-service";

export const countriesRouter = new Hono();

countriesRouter.get("/", getAllCountries);
