import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateProductsAPISchema } from "~/core/domain/products/validator/create-product-validator";
import { BundlesDS } from "~/core/infrastructure/drizzle/bundles";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { db } from "~/modules/drizzle";

export async function getProducts(c: Context<EnvAPI>) {
  return c.json({ msg: "OK" });
}

export async function getProduct(c: Context<EnvAPI>) {
  const id = c.req.param("id");
  const product = await ProductsDS.getByID(+id);
  if (!product) return c.json({ product });

  const groups = await GroupsDS.getGroupByProductID(product.product_id);
  const subgroups = await GroupsDS.getSubgroupByProductID(product.product_id);
  return c.json({ product: { ...product, groups, subgroups } });
}

export async function createProduct(c: Context<EnvAPI>) {
  // Validator
  const validator = CreateProductsAPISchema.safeParse(await c.req.json());
  if (!validator.success) return c.json({ status: 400, msg: "Incorrect payload" }, 400);

  // Product creation
  const singles = validator.data.products.filter((product) => product.product_type === "single");
  const bundles = validator.data.products.filter((product) => product.product_type === "bundle");

  // Single products creation
  c.var.log.info(`Products to be created: ${singles.length}`);
  for (const product of singles) {
    await db.transaction(async (tx) => {
      const [{ insertId }] = await ProductsDS.create(product, tx);
      if (product.group_id && product.group_id !== 0) await ProductsDS.addGroup(insertId, product.group_id, tx);
      if (product.subgroup_id && product.subgroup_id !== 0) await ProductsDS.addGroup(insertId, product.subgroup_id, tx);
    });
  }

  // Bundles creation
  c.var.log.info(`Bundles to be created: ${bundles.length}`);
  for (const product of bundles) {
    await db.transaction(async (tx) => {
      const [{ insertId }] = await BundlesDS.create(product, tx);
      if (product.group_id && product.group_id !== 0) await BundlesDS.addGroup(insertId, product.group_id, tx);
      if (product.subgroup_id && product.subgroup_id !== 0) await BundlesDS.addGroup(insertId, product.subgroup_id, tx);
    });
  }

  return c.json({ status: 200, msg: "Product creation was completed successfully!" });
}
