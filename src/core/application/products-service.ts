import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateProductsAPISchema } from "~/core/domain/products/validator/create-product-validator";
import { BundlesDS } from "~/core/infrastructure/drizzle/bundles";
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
  // Validator
  const validator = CreateProductsAPISchema.safeParse(await c.req.json());
  if (!validator.success) return c.json({ msg: "Incorrect payload" }, 400);

  // Product creation
  const singles = validator.data.products.filter((product) => product.product_type === "single");
  const bundles = validator.data.products.filter((product) => product.product_type === "bundle");

  // Single products creation
  c.var.log.info(`Products to be created: ${singles.length}`);
  for (const product of singles) {
    const [{ insertId }] = await ProductsDS.create(product);
    if (product.group_id && product.group_id !== 0) await ProductsDS.addGroup(insertId, product.group_id);
    if (product.subgroup_id && product.subgroup_id !== 0) await ProductsDS.addGroup(insertId, product.subgroup_id);
  }

  // Bundles creation
  c.var.log.info(`Bundles to be created: ${bundles.length}`);
  for (const product of bundles) {
    const [{ insertId }] = await BundlesDS.create(product);
    if (product.group_id && product.group_id !== 0) await BundlesDS.addGroup(insertId, product.group_id);
    if (product.subgroup_id && product.subgroup_id !== 0) await BundlesDS.addGroup(insertId, product.subgroup_id);
  }

  return c.json({ msg: "Products created successfully!" });
}
