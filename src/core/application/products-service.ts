import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateProductsAPISchema } from "~/core/domain/products/validator/create-product-validator";
import { BundlesDS } from "~/core/infrastructure/drizzle/bundles";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { db } from "~/modules/drizzle";

async function getProductsWithGroups(name: string | undefined) {
  const products = name ? await ProductsDS.findByName(name) : await ProductsDS.getAll();
  return Promise.all(
    products.map(async (product) => {
      const groups = await GroupsDS.getGroupByProductID(product.product_id);
      const subgroups = await GroupsDS.getSubgroupByProductID(product.product_id);
      return { ...product, product_type: "single", groups, subgroups };
    }),
  );
}

async function getBundlesWithGroups(name: string | undefined) {
  if (name) return []; // Don't search bundles by name

  const bundles = await BundlesDS.getAll();
  return Promise.all(
    bundles.map(async (bundle) => {
      const groups = await GroupsDS.getGroupByBundleID(bundle.bundle_id);
      const subgroups = await GroupsDS.getSubgroupByBundleID(bundle.bundle_id);
      return { ...bundle, product_type: "bundle", groups, subgroups };
    }),
  );
}

export async function getProducts(c: Context<EnvAPI>) {
  const name = c.req.query("name");
  const products = await getProductsWithGroups(name);
  const bundles = await getBundlesWithGroups(name);
  return c.json({ status: "success", data: [...products, ...bundles] });
}

export async function getProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  const product = await ProductsDS.getByID(+id);
  if (!product) return c.json({ status: "success", data: product });

  const groups = await GroupsDS.getGroupByProductID(product.product_id);
  const subgroups = await GroupsDS.getSubgroupByProductID(product.product_id);
  return c.json({ status: "success", data: { ...product, groups, subgroups } });
}

export async function createProduct(c: Context<EnvAPI>) {
  // Validator
  const validator = CreateProductsAPISchema.safeParse(await c.req.json());
  if (!validator.success) return c.json({ status: "error", msg: "Incorrect payload" }, 400);

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

  return c.json({ status: "success", msg: "Product creation was completed successfully!" });
}
