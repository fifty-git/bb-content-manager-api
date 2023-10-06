import type { EnvAPI } from "~/core/domain/types";
import type { Context } from "hono";
import { CreateProductsAPISchema } from "~/core/domain/products/validator/create-product-validator";
import { GroupsDS } from "~/core/infrastructure/drizzle/groups";
import { ProductOptionsDS } from "~/core/infrastructure/drizzle/product-options";
import { ProductVariantsDS } from "~/core/infrastructure/drizzle/product-variants";
import { ProductVarietiesDS } from "~/core/infrastructure/drizzle/product-varieties";
import { ProductsDS } from "~/core/infrastructure/drizzle/products";
import { db } from "~/modules/drizzle";

async function getProductsWithGroups(name: string | undefined) {
  const products = name ? await ProductsDS.findByName(name) : await ProductsDS.getAll();
  return Promise.all(
    products.map(async (product) => {
      const group = await GroupsDS.getGroupByProductID(product.product_id);
      const subgroup = await GroupsDS.getSubgroupByProductID(product.product_id);
      return { ...product, id: product.product_id, group, subgroup };
    }),
  );
}

export async function getProducts(c: Context<EnvAPI>) {
  const name = c.req.query("name");
  const products = await getProductsWithGroups(name);
  return c.json({ status: "success", data: products });
}

export async function getProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  const product = await ProductsDS.getByID(+id);
  if (!product) return c.json({ status: "success", data: product });

  const group = await GroupsDS.getGroupByProductID(product.product_id);
  const subgroup = await GroupsDS.getSubgroupByProductID(product.product_id);
  return c.json({ status: "success", data: { ...product, group, subgroup } });
}

export async function createProduct(c: Context<EnvAPI>) {
  // Validator
  const validator = CreateProductsAPISchema.safeParse(await c.req.json());
  if (!validator.success) return c.json({ status: "error", msg: "Incorrect payload" }, 400);

  // Product creation
  c.var.log.info(`Products to be created: ${validator.data.products.length}`);
  for (const product of validator.data.products) {
    await db.transaction(async (tx) => {
      const [{ insertId }] = await ProductsDS.create(product, tx);
      if (product.group_id && product.group_id !== 0) await ProductsDS.addGroup(insertId, product.group_id, tx);
      if (product.subgroup_id && product.subgroup_id !== 0) await ProductsDS.addGroup(insertId, product.subgroup_id, tx);
    });
  }

  return c.json({ status: "success", msg: "Product creation was completed successfully!" });
}

export async function enableProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  c.var.log.info(`Product to be enabled: ${id}`);

  await ProductsDS.enable(+id);
  return c.json({ status: "success", msg: `Product ${id} was enabled successfully` });
}

export async function disableProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  c.var.log.info(`Product to be disabled: ${id}`);

  await ProductsDS.disable(+id);
  return c.json({ status: "success", msg: `Product ${id} was disabled successfully` });
}

export async function deleteProduct(c: Context<EnvAPI>) {
  const id = c.req.param("product_id");
  c.var.log.info(`Product to be deleted: ${id}`);

  await db.transaction(async (tx) => {
    // Delete dependencies
    await ProductsDS.deleteGroups(+id, tx);
    await ProductsDS.deleteOptionValues(+id, tx);
    const variants = await ProductVariantsDS.getByProductID(+id, tx);
    const variant_ids = variants.map((v) => v.variant_id);
    await ProductOptionsDS.deleteManyByVariantID(variant_ids, tx);
    await ProductVariantsDS.deleteManyByProductID(+id, tx);
    await ProductVarietiesDS.deleteManyByProductID(+id, tx);
    await ProductsDS.deleteTags(+id, tx);

    // Delete product
    await ProductsDS.delete(+id, tx);
  });

  return c.json(null, 204);
}
