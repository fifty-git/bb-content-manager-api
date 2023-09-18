import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";

export async function getProducts(c: Context<EnvAPI>) {
  return c.json({ msg: "OK" });
}

export async function getProduct(c: Context<EnvAPI>) {
  const id = c.req.param("id");
  const product = await ProductsDS.getByID(+id);
  if (!product) return c.json({ product: {} });
  return c.json({ product });
}
