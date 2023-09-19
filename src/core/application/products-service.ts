import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateProductsAPISchema } from "~/core/domain/products/validator/create-product-validator";
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

export async function createProduct(c: Context<EnvAPI>) {
  const validator = CreateProductsAPISchema.safeParse(await c.req.json());
  if (!validator.success) return c.json({ msg: "Incorrect payload" }, 400);
  const singles = validator.data.products.filter((product) => product.product_type === "single");
  const bundles = validator.data.products.filter((product) => product.product_type === "bundle");
  return c.json({ singles, bundles });
}
